---
description: "Combo preset: Add Authentication + Billing + Teams + RBAC in one guided flow. For team-based SaaS products."
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — SaaS Teams Bundle

You are running the `/add-saas-teams` combo preset. This adds four modules for team-based SaaS:
1. **Authentication** — User identity
2. **Billing** — Subscription per team/org
3. **Teams** — Team management, invitations
4. **RBAC** — Role-based access control

## Step 1: Read Configuration

Read `.saas-playbook.yml`. Verify initialized. Skip already-enabled modules.

## Step 2: Combined Wizard

Gather all inputs upfront:

### Authentication
- Auth provider, login methods, session strategy, additional features

### Billing
- Provider, plans, trial, billing frequency
- Note: billing will be per-team/org

### Teams
- Team model (flat, org+teams, workspaces)
- Default roles (owner, admin, member, viewer)
- Invitation flow (email, link, both)
- Multi-team membership?

### RBAC
- RBAC model (role-based recommended for team SaaS)
- Permissions per role
- Resource types to protect
- Resource-level permissions needed?

Present summary for confirmation.

## Step 3: Execute in Dependency Order

### 1. Authentication
Scaffold auth following `/add-auth` flow.

### 2. Billing
Scaffold billing following `/add-billing` flow. Configure billing to be team-scoped.

### 3. Teams
Scaffold team management following `/add-teams` flow.

### 4. RBAC
Scaffold RBAC following `/add-rbac` flow. Integrate with team roles.

## Step 4: Cross-Module Integration

- **Auth + Teams**: Signup creates user + default team. Invited users join existing team.
- **Billing + Teams**: Subscription is per-team. Team owner manages billing. Seat-based pricing if applicable.
- **Teams + RBAC**: Team roles map to RBAC roles. Permission checks use team membership context.
- **All together**: Middleware chain: auth → team resolution → role check → permission check

Create integration code:
- Signup flow: create user → create team → assign owner role → create billing customer
- Invitation flow: invite → accept → join team → assign role
- Permission-gated UI and API routes

## Step 5: Update Config

Update all four feature sections in `.saas-playbook.yml`.

## Step 6: Summary

Comprehensive summary with all files, integration points, env vars, and next steps.
