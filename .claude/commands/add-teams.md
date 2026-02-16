---
description: Add team and organization management to your SaaS project. Includes invitations, member roles, and team settings.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Team Management Module

You are running the `/add-teams` command. Guide the user through adding team management.

## Step 1: Check Prerequisites

Read `.saas-playbook.yml`. Verify auth is enabled. If not: "Authentication is required. Run `/add-auth` first."

## Step 2: Team Configuration

Ask the user:
1. **Team model** — What structure fits your product?
   - **Flat teams** — Users belong to one or more teams (simplest)
   - **Organization + teams** — Org is the billing/tenant unit, teams are within orgs
   - **Workspaces** — Single level, workspace is the primary grouping
2. **Default roles** — What roles should teams have?
   - Owner (full control, billing management)
   - Admin (manage members, settings)
   - Member (standard access)
   - Viewer (read-only)
   - Custom roles?
3. **Invitation flow**:
   - Email invitation (send invite email with link)
   - Invite link (shareable join link)
   - Both
4. **Multi-team?** — Can users belong to multiple teams?
5. **Team limits?** — Max members per team? Max teams per user?

## Step 3: Scaffold

Run the scaffolding script with the user's choices:

```
node scripts/scaffold.js add-teams \
  --model=<team|organization|workspace> \
  --roles=<comma-separated-roles> \
  --invitationFlow=<email|link|both>
```

The script will create all team management boilerplate (team/invitation models, CRUD API, member management API, teams page, invite form, member list component, Prisma models). Review its output and then:
- Customize invitation email templates for the product
- Add any team-specific business logic not covered by templates
- Wire up team context into existing features

## Step 4: Update Config

Update `.saas-playbook.yml`:
- Set `features.teams.enabled: true`
- Set `features.teams.roles` to chosen roles

## Step 5: Summary

List created files and suggest:
- "Run `/add-rbac` to add fine-grained permissions"
- "Run `/add-notifications` to send team-related notifications"
