---
description: Add multi-tenancy support to your SaaS project. Supports row-level, schema-per-tenant, and database-per-tenant isolation strategies.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Multi-Tenancy Module

You are running the `/add-multi-tenancy` command. Guide the user through adding multi-tenancy.

## Step 1: Check Prerequisites

Read `.saas-playbook.yml`. Verify that **authentication is enabled**. If not: "Authentication is required for multi-tenancy. Run `/add-auth` first."

## Step 2: Explain Strategies

Present the three multi-tenancy strategies with trade-offs:

### Row-Level Isolation (Recommended for most)
- Single database, `tenant_id` column on every tenant-scoped table
- All queries automatically filtered by tenant
- **Pros**: Simple, cost-effective, easy to maintain, scales well
- **Cons**: Must ensure every query is scoped (risk of data leaks if not)
- **Best for**: Most SaaS applications, startups, SMB products

### Schema-Per-Tenant
- Each tenant gets their own database schema
- Application switches schema based on tenant context
- **Pros**: Better isolation, easier per-tenant backup/restore, compliance-friendly
- **Cons**: Migration complexity (apply to all schemas), connection management
- **Best for**: Regulated industries (healthcare, finance), enterprise customers

### Database-Per-Tenant
- Each tenant gets a completely separate database
- Maximum isolation but highest operational complexity
- **Pros**: Complete isolation, independent scaling, easy tenant portability
- **Cons**: Very complex operations, expensive, migration across all DBs
- **Best for**: Enterprise-only products with strict compliance requirements

## Step 3: Configuration Questions

Ask the user:
1. **Isolation strategy** — Which strategy? (recommend row-level for most)
2. **Tenant identification** — How is the tenant identified in requests?
   - From auth context (user's associated tenant — simplest)
   - Subdomain (`acme.yourapp.com`)
   - URL path prefix (`/org/acme/...`)
   - Custom header (`X-Tenant-ID`)
3. **Tenant terminology** — What fits your product? (organization, workspace, team, company, account)
4. **Multi-tenant users?** — Can a user belong to multiple tenants?
5. **Default tenant limits?** — Max users, max storage, etc.?

## Step 4: Scaffold

Run the scaffolding script with the user's choices:

```
node scripts/scaffold.js add-multi-tenancy \
  --strategy=<row-level|schema-per-tenant|database-per-tenant> \
  --identification=<subdomain|path|header> \
  --terminology=<organization|workspace|team|company>
```

The script will create all multi-tenancy boilerplate (tenant resolution, context provider, middleware, CRUD API, settings page, tenant switcher, Prisma models, env vars). Review its output and then:
- Add `tenantId` column to any existing tenant-scoped models
- Wire up tenant scoping into existing queries
- Customize the tenant creation flow for the specific product

## Step 5: Update Config

Update `.saas-playbook.yml`:
- Set `features.multi-tenancy.enabled: true`
- Set `features.multi-tenancy.strategy`

## Step 6: Summary and Next Steps

List created files and suggest:
- "Run `/add-teams` to add team management within tenants"
- "Run `/add-rbac` to add role-based access control"
- "Ensure all existing and future queries are tenant-scoped"
