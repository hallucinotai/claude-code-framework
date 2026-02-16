---
description: Add authentication and authorization to your SaaS project. Supports multiple providers and strategies with full code scaffolding.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Authentication Module

You are running the `/add-auth` command. Guide the user through adding authentication to their project.

## Step 1: Read Configuration

Read `.saas-playbook.yml` for the current stack and enabled features. Verify the project is initialized. If auth is already enabled, inform the user and ask if they want to reconfigure.

## Step 2: Auth Strategy

Ask the user about their auth strategy:
1. **Auth provider/library** — Based on stack, suggest the best options:
   - **Next.js**: NextAuth.js / Auth.js (recommended), Clerk (hosted), Lucia, Supabase Auth
   - **SvelteKit**: Lucia (recommended), Supabase Auth, custom
   - **Express/Fastify**: Passport.js, custom JWT, Lucia
   - **Django**: Django Auth (built-in), django-allauth
   - **FastAPI**: Custom JWT, python-jose
2. **Auth methods** — Which login methods to support:
   - Email/password
   - Magic link (passwordless email)
   - OAuth providers (Google, GitHub, Discord, Twitter, Microsoft)
3. **Session strategy** — JWT tokens or server-side sessions?
4. **Additional features**:
   - Two-factor authentication (2FA/MFA)?
   - SSO/SAML (enterprise)?
   - Password reset flow?
   - Email verification?

## Step 3: Scaffold

Run the scaffolding script with the user's choices:

```
node scripts/scaffold.js add-auth \
  --providers=<comma-separated-providers> \
  --strategy=<jwt|session> \
  --features=<2fa,password-reset,email-verification,sso>
```

The script will create all auth boilerplate files (NextAuth config, login/signup pages, middleware, Prisma models, components, env vars). Review its output and then:
- Customize any generated TODO comments with project-specific logic
- Add any project-specific auth rules not covered by templates
- If the user needs custom password validation rules or custom OAuth scopes, add those manually

## Step 4: Update Config

Update `.saas-playbook.yml`:
- Set `features.auth.enabled: true`
- Set `features.auth.providers` to chosen providers
- Set `features.auth.strategy` to chosen strategy
- Set `stack.auth` to chosen library

## Step 5: Summary and Next Steps

List all created files and suggest:
- "Run `/add-billing` to add subscription billing"
- "Run `/add-teams` to add team management"
- "Run `/add-rbac` to add role-based access control"
- "Test your auth setup by running the dev server"
