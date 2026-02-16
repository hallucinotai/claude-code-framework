---
description: "Combo preset: Add ALL SaaS modules — Auth, Billing, Multi-tenancy, Teams, RBAC, Notifications, Onboarding, Analytics."
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Full SaaS Bundle

You are running the `/add-saas-full` combo preset. This adds ALL eight SaaS modules in one comprehensive guided flow:

1. **Authentication** — User identity and login
2. **Billing** — Subscription plans and payments
3. **Multi-tenancy** — Tenant isolation
4. **Teams** — Team/org management
5. **RBAC** — Role-based access control
6. **Notifications** — Email, in-app, push
7. **Onboarding** — New user onboarding flow
8. **Analytics** — Usage tracking and events

## Step 1: Read Configuration

Read `.saas-playbook.yml`. Verify initialized. Skip already-enabled modules.

## Step 2: Combined Wizard

Gather inputs for all modules, grouped by category for clarity:

### Core SaaS (Auth + Billing + Multi-tenancy)
- Auth: provider, login methods, session strategy, additional features
- Billing: provider, plans, trial, frequency
- Multi-tenancy: isolation strategy, tenant identification, terminology

### Team & Access (Teams + RBAC)
- Teams: model, roles, invitation flow, multi-team
- RBAC: model, permissions per role, resource types

### User Experience (Notifications + Onboarding)
- Notifications: channels, email provider, real-time, preferences
- Onboarding: steps, checklist, guided tour, skip option

### Intelligence (Analytics)
- Analytics: provider, key events, server-side, privacy

Present a complete summary of ALL choices before proceeding. This is a big setup — confirm everything is correct.

## Step 3: Execute in Dependency Order

### Phase 1: Foundation
1. **Authentication** — Everything else depends on this

### Phase 2: Business Model
2. **Billing** — Needs auth
3. **Multi-tenancy** — Needs auth

### Phase 3: Team Structure
4. **Teams** — Needs auth, optionally multi-tenancy
5. **RBAC** — Needs auth, integrates with teams

### Phase 4: User Experience
6. **Notifications** — Can notify about team, billing, and other events
7. **Onboarding** — References all other modules in onboarding steps

### Phase 5: Intelligence
8. **Analytics** — Tracks events across all modules

## Step 4: Cross-Module Integration

Ensure all modules work together harmoniously:
- Auth creates user + tenant + billing customer
- Teams integrate with multi-tenancy (teams within tenants)
- RBAC roles integrate with team roles
- Notifications trigger on auth events (welcome), billing events (payment), team events (invitation)
- Onboarding steps reference: profile setup, team creation, first feature use
- Analytics tracks: signups, feature usage, plan changes, team activity

Create comprehensive middleware chain:
```
Request → Auth → Tenant Resolution → Team Context → Permission Check → Rate Limit → Handler
```

## Step 5: Update Config

Update ALL feature sections in `.saas-playbook.yml`. Set progress for all features.

## Step 6: Comprehensive Summary

Provide a full summary:
- Total files created (grouped by module)
- Complete middleware chain
- All environment variables needed
- Complete feature matrix (what's enabled)
- Immediate next steps: "Start building your product features with `/add-feature`"
- Quality steps: "Run `/test-setup` to configure testing, `/deploy-setup` for deployment"
