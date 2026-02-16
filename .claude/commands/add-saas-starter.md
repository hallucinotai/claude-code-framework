---
description: "Combo preset: Add Authentication + Billing + Multi-tenancy in one guided flow. The essential SaaS foundation."
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — SaaS Starter Bundle

You are running the `/add-saas-starter` combo preset. This adds the three core SaaS modules in one guided flow:
1. **Authentication** — User identity, login, signup
2. **Billing** — Subscription plans, payments
3. **Multi-tenancy** — Tenant isolation, scoped data

## Step 1: Read Configuration

Read `.saas-playbook.yml`. Verify the project is initialized. Check which of the three modules are already enabled and skip those.

## Step 2: Combined Wizard

Gather all inputs upfront in a single wizard flow, grouped by module:

### Authentication Questions
- Auth provider/library (based on stack)
- Login methods (email/password, OAuth providers, magic link)
- Session strategy (JWT or sessions)
- Additional: 2FA, SSO, password reset, email verification

### Billing Questions
- Billing provider (Stripe recommended)
- Plan structure (names, pricing, features per plan)
- Free tier? Trial period?
- Billing frequency (monthly, yearly, both)

### Multi-Tenancy Questions
- Isolation strategy (row-level recommended)
- Tenant identification method
- Tenant terminology (organization, workspace, etc.)
- Can users belong to multiple tenants?

Present a summary of all choices for confirmation before proceeding.

## Step 3: Execute in Dependency Order

Implement each module following its respective `/add-*` command flow:

### 1. Authentication (first — others depend on it)
Follow the `/add-auth` scaffolding process with the gathered inputs.

### 2. Billing (depends on auth)
Follow the `/add-billing` scaffolding process. Ensure:
- Billing is linked to authenticated users
- Subscription status is accessible from user context

### 3. Multi-tenancy (depends on auth)
Follow the `/add-multi-tenancy` scaffolding process. Ensure:
- Tenant is associated with users from auth
- New signups create a tenant automatically

## Step 4: Cross-Module Integration

After scaffolding all three, ensure they work together:
- **Auth + Billing**: Creating an account also creates a Stripe customer. Subscription is checked on auth.
- **Auth + Multi-tenancy**: Signup creates a tenant. Login resolves tenant context.
- **Billing + Multi-tenancy**: Subscriptions are per-tenant, not per-user. Plan limits apply at tenant level.

Create integration glue code:
- Signup flow that creates user + tenant + billing customer
- Middleware chain: auth → tenant resolution → plan check
- Dashboard that shows tenant name + current plan

## Step 5: Update Config

Update all three feature sections in `.saas-playbook.yml`.

## Step 6: Summary

Provide a comprehensive summary:
- All files created (grouped by module)
- Integration points
- Environment variables needed
- Suggest next steps: "/add-teams for team management, /add-rbac for permissions, or /add-feature to start building your product"
