---
description: Add role-based access control to your SaaS project. Supports role-based, permission-based, and attribute-based models.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Role-Based Access Control Module

You are running the `/add-rbac` command. Guide the user through adding RBAC.

## Step 1: Check Prerequisites

Read `.saas-playbook.yml`. Verify auth is enabled.

## Step 2: Explain RBAC Models

### Role-Based (Recommended for most)
- Users are assigned roles (admin, member, viewer)
- Roles have a fixed set of permissions
- Simple to understand and implement
- **Best for**: Most SaaS apps, teams < 100 people

### Permission-Based
- Fine-grained permissions assigned to roles or directly to users
- More flexible but more complex
- Permissions like `projects.create`, `projects.delete`, `billing.manage`
- **Best for**: Enterprise SaaS with complex access needs

### Attribute-Based (ABAC)
- Access decisions based on user attributes, resource attributes, and context
- Most flexible, most complex
- Example: "Users can edit projects they own OR projects in their team"
- **Best for**: Complex authorization rules, document-based systems

## Step 3: Configuration

Ask the user:
1. **RBAC model** — Role-based, permission-based, or attribute-based?
2. **Default roles and permissions** — Define roles with their permissions:
   - Example: Owner (all), Admin (manage members, settings), Member (create, read, update), Viewer (read only)
3. **Resource types** — What resources need permission checks? (projects, documents, settings, billing, etc.)
4. **Resource-level permissions?** — Per-resource access (e.g., user can access project A but not project B)?
5. **UI visibility** — Should UI elements be hidden based on permissions?

## Step 4: Scaffold

Run the scaffolding script with the user's choices:

```
node scripts/scaffold.js add-rbac \
  --model=<role-based|permission-based> \
  --roles=<comma-separated-roles> \
  --resources=<comma-separated-resources>
```

The script will create all RBAC boilerplate (permission definitions, role-permission matrix, middleware helpers, PermissionGate component, RoleSelect component, seed script, Prisma models if permission-based). Review its output and then:
- Customize the ROLE_PERMISSIONS matrix in `lib/rbac.ts` for your specific features
- Add `requirePermission()` calls to existing API routes
- Wrap existing UI elements with `<PermissionGate>` where needed

## Step 5: Update Config

Update `.saas-playbook.yml`:
- Set `features.rbac.enabled: true`
- Set `features.rbac.model`

## Step 6: Summary

List created files and suggest applying permission checks to existing routes and UI.
