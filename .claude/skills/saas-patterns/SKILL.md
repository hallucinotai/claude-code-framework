---
name: saas-patterns
description: Reference this skill when designing SaaS architecture, implementing multi-tenant systems, or making decisions about SaaS pricing models, tenant isolation, scaling strategies, and security best practices.
---

# SaaS Architecture Patterns

## Multi-Tenant Architecture Models

### Single Database, Shared Schema (Row-Level Isolation)
- Every table has a `tenant_id` column
- All queries must be scoped by tenant_id
- Use middleware or ORM global scopes to enforce
- Pros: Simple, cost-effective, easy to maintain
- Cons: Risk of data leaks if query scoping fails
- Best for: Most SaaS applications, startups, SMB products

```
-- Example: Tenant-scoped query
SELECT * FROM projects WHERE tenant_id = $1 AND id = $2;
```

### Schema-Per-Tenant
- Each tenant gets their own database schema
- Application switches schema based on tenant context
- Pros: Better isolation, easier per-tenant backup/restore
- Cons: Migration complexity (must apply to all schemas), connection management
- Best for: Regulated industries (healthcare, finance), enterprise customers

### Database-Per-Tenant
- Each tenant gets a completely separate database
- Maximum isolation but highest operational complexity
- Pros: Complete isolation, independent scaling, easy to move tenants
- Cons: Very complex operations, expensive, migration nightmare
- Best for: Enterprise-only products with strict compliance requirements

## SaaS Pricing Models

### Flat-Rate Pricing
- Single price, all features included
- Simple to understand and implement
- Example: Basecamp ($99/month, unlimited users)

### Tiered Pricing
- Multiple plans with increasing features/limits
- Most common SaaS model
- Typical tiers: Free/Starter, Pro, Enterprise
- Feature gating + usage limits per tier

### Per-Seat Pricing
- Price based on number of users
- Common for B2B SaaS
- Consider: Do all users need the same access level?

### Usage-Based Pricing
- Pay for what you use (API calls, storage, compute)
- Requires metering infrastructure
- Common for developer tools and infrastructure SaaS

### Hybrid Pricing
- Base plan + usage overages
- Example: Base plan includes 10K API calls, $0.01 per additional call

## SaaS Security Best Practices

### Authentication
- Never roll your own crypto
- Use battle-tested auth libraries
- Implement proper session management
- Support MFA for enterprise customers
- Enforce password policies (length > complexity)

### Authorization
- Enforce at every layer (API, service, database)
- Never trust client-side authorization alone
- Log all authorization failures
- Implement principle of least privilege

### Tenant Isolation
- Verify tenant context on every request
- Use database-level isolation when possible (RLS policies)
- Never expose internal tenant IDs in URLs
- Audit cross-tenant access attempts

### Data Protection
- Encrypt sensitive data at rest
- Use TLS for all communications
- Implement proper key management
- Regular security audits
- GDPR/CCPA compliance considerations

## Scaling Strategies

### Vertical Scaling (Scale Up)
- Increase server resources
- Simple but has limits
- Good for early stage

### Horizontal Scaling (Scale Out)
- Add more instances
- Requires stateless application design
- Use load balancers, session stores (Redis)

### Database Scaling
- Read replicas for read-heavy workloads
- Connection pooling (PgBouncer, ProxySQL)
- Partitioning for large tables
- Caching layer (Redis) for hot data

### Background Processing
- Use job queues for async operations
- Email sending, report generation, data processing
- Tools: BullMQ (Node.js), Celery (Python), Sidekiq (Ruby)

## Feature Flag System

### Implementation Pattern
```typescript
// Feature flags tied to subscription plans
interface FeatureFlag {
  name: string;
  enabledForPlans: string[];
  enabledForTenants?: string[];  // Override for specific tenants
  percentage?: number;            // Gradual rollout
}

function canAccess(feature: string, tenant: Tenant): boolean {
  const flag = getFeatureFlag(feature);
  if (flag.enabledForTenants?.includes(tenant.id)) return true;
  return flag.enabledForPlans.includes(tenant.plan);
}
```

### Common Feature Gates
- Storage limits per plan
- API rate limits per plan
- Feature availability per plan
- User/seat limits per plan
- Priority support tiers
