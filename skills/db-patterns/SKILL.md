---
name: db-patterns
description: Reference this skill when designing database schemas for multi-tenant SaaS, implementing row-level security, managing migrations, optimizing queries, or designing data isolation strategies.
---

# Database Design Patterns for SaaS

## Row-Level Security (RLS)

### PostgreSQL RLS
```sql
-- Enable RLS on table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy: users can only see their tenant's data
CREATE POLICY tenant_isolation ON projects
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Set tenant context per request
SET app.current_tenant_id = 'tenant-uuid-here';
```

### Application-Level RLS (ORM Middleware)

#### Prisma
```typescript
// Prisma middleware for tenant scoping
prisma.$use(async (params, next) => {
  if (params.model && tenantScopedModels.includes(params.model)) {
    // Inject tenant_id in where clauses
    if (params.action === 'findMany' || params.action === 'findFirst') {
      params.args.where = {
        ...params.args.where,
        tenantId: currentTenantId,
      };
    }
    // Inject tenant_id in create
    if (params.action === 'create') {
      params.args.data.tenantId = currentTenantId;
    }
  }
  return next(params);
});
```

#### Drizzle
```typescript
// Scoped query helper
function tenantScope<T extends { tenantId: string }>(
  table: T,
  tenantId: string
) {
  return eq(table.tenantId, tenantId);
}

// Usage
const projects = await db
  .select()
  .from(projectsTable)
  .where(tenantScope(projectsTable, ctx.tenantId));
```

## Essential SaaS Tables

### Users & Auth
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  email_verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE accounts (  -- OAuth provider accounts
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  UNIQUE(provider, provider_account_id)
);
```

### Tenants & Membership
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  plan VARCHAR(50) DEFAULT 'free',
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tenant_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

CREATE INDEX idx_tenant_members_tenant ON tenant_members(tenant_id);
CREATE INDEX idx_tenant_members_user ON tenant_members(user_id);
```

### Subscriptions & Billing
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_price_id VARCHAR(255),
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,  -- active, canceled, past_due, trialing
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  trial_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_tenant ON subscriptions(tenant_id);
```

## Soft Deletes

```sql
-- Add to tables that need soft delete
ALTER TABLE projects ADD COLUMN deleted_at TIMESTAMP;

-- Query only active records
SELECT * FROM projects
WHERE tenant_id = $1 AND deleted_at IS NULL;

-- Soft delete
UPDATE projects SET deleted_at = NOW() WHERE id = $1;
```

### ORM Implementation
```typescript
// Prisma: Use middleware
prisma.$use(async (params, next) => {
  if (params.action === 'delete') {
    params.action = 'update';
    params.args.data = { deletedAt: new Date() };
  }
  if (['findMany', 'findFirst'].includes(params.action)) {
    params.args.where = { ...params.args.where, deletedAt: null };
  }
  return next(params);
});
```

## Audit Logging

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID,
  action VARCHAR(100) NOT NULL,    -- 'project.created', 'member.invited'
  resource_type VARCHAR(100),       -- 'project', 'team_member'
  resource_id UUID,
  changes JSONB,                    -- { field: { old: x, new: y } }
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_tenant ON audit_logs(tenant_id, created_at DESC);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
```

## Migration Best Practices

### Zero-Downtime Migrations
1. **Add column** (nullable) -> deploy -> **backfill** -> **add constraint**
2. Never rename columns directly -- add new, migrate data, drop old
3. Never drop columns in the same deploy that stops writing to them
4. Add indexes concurrently: `CREATE INDEX CONCURRENTLY`

### Migration Checklist
- [ ] Can this migration run while the app is serving traffic?
- [ ] Is there a rollback plan?
- [ ] Will this lock any tables for extended periods?
- [ ] Are there large data backfills that should be async?

## Indexing Strategy

### Essential Indexes for SaaS
```sql
-- Every tenant-scoped table
CREATE INDEX idx_[table]_tenant ON [table](tenant_id);

-- Common query patterns
CREATE INDEX idx_[table]_tenant_created ON [table](tenant_id, created_at DESC);
CREATE INDEX idx_[table]_tenant_status ON [table](tenant_id, status);

-- Full-text search
CREATE INDEX idx_[table]_search ON [table] USING gin(to_tsvector('english', name || ' ' || description));
```

### Connection Pooling
- Use PgBouncer or built-in pool (Prisma pool, SQLAlchemy pool)
- Set pool size based on: max_connections / (number_of_app_instances)
- Transaction pooling mode for multi-tenant (session pooling for schema-per-tenant)

## Data Seeding

```typescript
// Seed file for development
async function seed() {
  // Create test tenant
  const tenant = await db.tenant.create({
    data: { name: 'Test Company', slug: 'test-co', plan: 'pro' },
  });

  // Create test user
  const user = await db.user.create({
    data: { email: 'test@example.com', name: 'Test User' },
  });

  // Create membership
  await db.tenantMember.create({
    data: { tenantId: tenant.id, userId: user.id, role: 'owner' },
  });

  // Create sample domain data
  // ...
}
```
