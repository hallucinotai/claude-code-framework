---
description: Initialize a new SaaS project with guided setup wizard. Creates project config, selects tech stack, and scaffolds initial structure.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Project Initialization Wizard

You are running the `/init` command for the SaaS Playbook framework. Guide the user through setting up a new SaaS project step by step.

## Step 1: Read Current State

First, check if `.saas-playbook.yml` exists in the current directory:
- If it exists, read it and inform the user of the current configuration. Ask if they want to reconfigure or keep existing settings.
- If it doesn't exist, inform the user you'll create one.

## Step 2: Project Identity

Ask the user:
1. **Project name** — What is your project called? (used for package.json, directory names)
2. **One-line description** — What does this SaaS do in one sentence?
3. **Project context** — Ask for a brief description of the SaaS application: Who are the target users? What problem does it solve? This context will be used to make better architectural decisions later.

## Step 3: Tech Stack Selection

Run the tech stack selection flow. Present these popular preset combinations:

### Presets
1. **The Next.js Full-Stack** — Next.js + Prisma + PostgreSQL + NextAuth + Tailwind CSS + Vitest
2. **The T3 Stack** — Next.js + tRPC + Prisma + PostgreSQL + NextAuth + Tailwind CSS
3. **The SvelteKit Stack** — SvelteKit + Drizzle + PostgreSQL + Lucia + Tailwind CSS
4. **The Python Stack** — Django or FastAPI + SQLAlchemy + PostgreSQL + React/Vue frontend
5. **Custom** — Pick every component individually

If the user selects a preset, confirm the choices and allow overrides. If custom, walk through each choice:
- Language (TypeScript, JavaScript, Python, Ruby, or custom)
- Frontend framework (Next.js, SvelteKit, Remix, Nuxt, React + Vite, Vue + Vite, custom)
- Backend approach (same-framework API routes, Express, Fastify, NestJS, Django, FastAPI, Rails, custom)
- Database (PostgreSQL, MySQL, MongoDB, SQLite)
- ORM (Prisma, Drizzle, TypeORM, Sequelize, SQLAlchemy, custom)
- CSS/Styling (Tailwind CSS, CSS Modules, styled-components, Sass, custom)
- Testing: unit (Vitest, Jest, pytest, custom) and e2e (Playwright, Cypress, custom)
- Package manager (npm, pnpm, bun, yarn)
- Hosting target (Vercel, AWS, Docker, Railway, Fly.io, custom)

For each choice, briefly explain the trade-offs to help the user decide.

## Step 3.5: Docker Setup

Ask the user:

> **Would you like to dockerize your application?**
> This sets up a complete local dev environment with Docker Compose including:
> - **App** — Your Next.js application
> - **PostgreSQL** — Database
> - **Redis** — Caching and sessions
> - **Mailpit** — Local email testing (web UI on :8025, SMTP on :1025)
>
> You can always add Docker later with `/deploy-setup --provider=docker`.

Options:
1. **Yes** — Include Dockerfile, docker-compose.yml, and .dockerignore in the scaffolded project
2. **No** — Skip Docker setup for now

Store their choice as a boolean (e.g. `dockerize: true/false`).

## Step 4: SaaS Features Selection

Present the list of available SaaS modules and ask which to enable. Group them clearly:

### Core SaaS
- **Authentication** (`/add-auth`) — Login, signup, OAuth providers, session management
- **Billing** (`/add-billing`) — Subscription plans, payment processing, customer portal
- **Multi-tenancy** (`/add-multi-tenancy`) — Tenant isolation, scoped data access

### Team & Access
- **Teams** (`/add-teams`) — Organization/team management, invitations, member roles
- **RBAC** (`/add-rbac`) — Role-based access control, permissions, authorization

### User Experience
- **Notifications** (`/add-notifications`) — Email, in-app, push notifications
- **Onboarding** (`/add-onboarding`) — Guided user onboarding flow
- **Analytics** (`/add-analytics`) — Usage tracking, event analytics

### Combo Presets
- **SaaS Starter** — Auth + Billing + Multi-tenancy
- **SaaS Teams** — Auth + Billing + Teams + RBAC
- **SaaS Full** — All modules

The user can select individual features, a combo preset, or none (add later).

## Step 5: Architecture Pattern

Based on the chosen stack and features, suggest an architecture pattern:
- **Modular Monolith** — Recommended for most projects starting out
- **Monolith** — Simplest, good for MVPs and small teams
- **Microservices** — For large teams with clear domain boundaries

Also ask about API style:
- **REST** — Standard, widely understood
- **GraphQL** — Flexible querying, good for complex UIs
- **tRPC** — End-to-end type safety (TypeScript only)

## Step 6: Create Configuration

Write the `.saas-playbook.yml` file with all the user's choices. Set `progress.initialized: true`.

If the user chose Docker in Step 3.5, also set `deployment.containerized: true` in the config.

## Step 7: Generate CLAUDE.md

Create or update the project's `CLAUDE.md` file tailored to the chosen stack. Include:
1. **Project Overview** — Name, description, what the SaaS does
2. **Tech Stack Reference** — Quick reference of all chosen technologies
3. **Architecture Conventions** — Based on chosen pattern
4. **Code Style** — Language/framework-specific conventions
5. **Available Commands** — Quick reference to all `/` commands
6. **Config Location** — Points to `.saas-playbook.yml`
7. **Development Workflow** — How to run dev server, tests, linting (based on stack)
8. **Feature Module Pattern** — How new features should be structured

## Step 8: Scaffold Initial Structure

Run the scaffolding script with the user's choices:

```
node scripts/scaffold.js init-project \
  --name=<project-name> \
  --description="<project-description>" \
  --docker=<true|false>
```

Include `--docker=true` if the user chose Docker in Step 3.5.

The script will create all boilerplate files (package.json, tsconfig.json, .eslintrc, tailwind.config, prisma/schema.prisma, app/layout.tsx, app/page.tsx, etc.). When Docker is enabled, it also generates `Dockerfile`, `docker-compose.yml`, and `.dockerignore`. Review its output and then:
- Verify the generated files match the user's preferences
- Make any project-specific customizations the templates don't cover

**Do NOT install dependencies yet** — just scaffold the structure. The user may want to review first.

## Step 9: Initialize Git

If not already a git repository, initialize one with `git init`.

## Step 10: Summary and Next Steps

Print a clear summary:
```
Project: [name]
Stack: [frontend] + [backend] + [database]
Features: [list of enabled features]
Architecture: [pattern] with [api-style] API

Files created:
  - .saas-playbook.yml (project config)
  - CLAUDE.md (project instructions)
  - [list of scaffolded files]
```

If Docker was enabled, also list the Docker files in the summary (Dockerfile, docker-compose.yml, .dockerignore) and mention:
- "Run `docker compose up` to start the full dev environment (App + PostgreSQL + Redis + Mailpit)"
- "Mailpit web UI available at http://localhost:8025"

Suggest next steps based on choices:
- If architecture not yet designed: "Run `/architect` to design your application architecture"
- If features enabled but not implemented: "Run `/add-auth` to set up authentication" (or whichever is first)
- If using a combo preset: "Run `/add-saas-starter` to set up all core SaaS features"
- Always mention: "Run `/status` at any time to see your project progress"
