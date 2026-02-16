---
description: Interactively select or modify the technology stack for your SaaS project. Suggests popular combinations with trade-offs.
allowed-tools: Bash, Read, Write, Edit
---

# SaaS Playbook — Tech Stack Selector

You are running the `/tech-stack` command. Guide the user through selecting or modifying their technology stack.

## Step 1: Read Current State

Read `.saas-playbook.yml` from the project root.
- If it exists and has stack values set, display the current stack and ask if the user wants to modify specific parts or start fresh.
- If it doesn't exist, inform the user to run `/init` first, but proceed with stack selection if they want.

## Step 2: Present Presets

Offer these curated stack presets with brief descriptions:

### 1. The Next.js Full-Stack
```
Language:    TypeScript
Frontend:    Next.js (App Router)
Backend:     Next.js API Routes
Database:    PostgreSQL
ORM:         Prisma
Auth:        NextAuth.js
CSS:         Tailwind CSS
Testing:     Vitest (unit) + Playwright (e2e)
Pkg Manager: pnpm
```
Best for: Most SaaS projects. Great DX, full-stack in one framework, excellent ecosystem.

### 2. The T3 Stack
```
Language:    TypeScript
Frontend:    Next.js (App Router)
Backend:     Next.js + tRPC
Database:    PostgreSQL
ORM:         Prisma
Auth:        NextAuth.js
CSS:         Tailwind CSS
Testing:     Vitest (unit) + Playwright (e2e)
Pkg Manager: pnpm
```
Best for: TypeScript purists who want end-to-end type safety. tRPC eliminates API schema drift.

### 3. The SvelteKit Stack
```
Language:    TypeScript
Frontend:    SvelteKit
Backend:     SvelteKit API Routes
Database:    PostgreSQL
ORM:         Drizzle
Auth:        Lucia
CSS:         Tailwind CSS
Testing:     Vitest (unit) + Playwright (e2e)
Pkg Manager: pnpm
```
Best for: Teams who want a lighter, faster alternative to React with excellent performance.

### 4. The Python Stack
```
Language:    Python + TypeScript
Frontend:    React (Vite) or Vue (Vite)
Backend:     FastAPI or Django
Database:    PostgreSQL
ORM:         SQLAlchemy
Auth:        Custom JWT or Django Auth
CSS:         Tailwind CSS
Testing:     pytest (unit) + Playwright (e2e)
Pkg Manager: npm (frontend), pip/poetry (backend)
```
Best for: Python teams, ML/AI-heavy applications, teams with Django/FastAPI experience.

### 5. Custom
Pick every component individually.

## Step 3: Walk Through Choices (if custom or modifying)

For each technology category, present options with concise trade-offs:

### Language
- **TypeScript** — Type safety, better IDE support, catch bugs early. Industry standard for web.
- **JavaScript** — Simpler, no compilation step, faster to prototype.
- **Python** — Great ecosystem for data/ML, Django is batteries-included.
- **Ruby** — Rails is extremely productive for CRUD-heavy SaaS.
- **Custom** — Specify your own.

### Frontend Framework
- **Next.js** — React-based, SSR/SSG, huge ecosystem, Vercel-optimized.
- **SvelteKit** — Lighter, faster, less boilerplate, growing ecosystem.
- **Remix** — React-based, web-standards focused, excellent nested routing.
- **Nuxt** — Vue-based, similar to Next.js but for Vue developers.
- **React + Vite** — SPA approach, maximum flexibility, no SSR by default.
- **Custom** — Specify your own.

### Backend
- **Same-framework API routes** — Simplest. One deployment, one codebase.
- **Express** — Minimal, flexible, massive middleware ecosystem.
- **Fastify** — Like Express but faster, built-in schema validation.
- **NestJS** — Enterprise-grade, Angular-inspired, excellent for large teams.
- **Django** — Batteries-included Python framework, admin panel, ORM included.
- **FastAPI** — Modern Python, async, auto-generated API docs.
- **Rails** — Convention over configuration, extremely productive.
- **Custom** — Specify your own.

### Database
- **PostgreSQL** — Best all-around choice. JSONB, full-text search, rock-solid.
- **MySQL** — Widely deployed, good performance, simpler than Postgres.
- **MongoDB** — Document-based, flexible schema, good for rapid prototyping.
- **SQLite** — Zero-config, good for development and small deployments.

### ORM / Query Builder
- **Prisma** — Best DX, auto-generated types, visual studio, migrations.
- **Drizzle** — Lightweight, SQL-like syntax, excellent TypeScript support.
- **TypeORM** — Decorator-based, familiar for NestJS/Java devs.
- **Sequelize** — Mature, feature-rich, good documentation.
- **SQLAlchemy** — Python standard, extremely powerful, flexible.
- **Custom** — Specify your own.

### CSS / Styling
- **Tailwind CSS** — Utility-first, fast development, consistent design.
- **CSS Modules** — Scoped CSS, no runtime cost, simple.
- **styled-components** — CSS-in-JS, dynamic styles, component-scoped.
- **Sass/SCSS** — Enhanced CSS, variables, nesting, mixins.
- **Custom** — Specify your own.

### Testing
**Unit:**
- **Vitest** — Fast, Vite-native, Jest-compatible API.
- **Jest** — Most popular, huge ecosystem, good for React.
- **pytest** — Python standard, powerful fixtures, excellent plugins.

**E2E:**
- **Playwright** — Multi-browser, auto-wait, excellent debugging.
- **Cypress** — Developer-friendly, great UI, single browser per run.

### Package Manager
- **pnpm** — Fastest, disk-efficient, strict dependency resolution.
- **npm** — Default, universal, no extra install needed.
- **bun** — Extremely fast, all-in-one runtime + package manager.
- **yarn** — Reliable, workspaces support, plug'n'play option.

### Hosting
- **Vercel** — Best for Next.js, zero-config, generous free tier.
- **AWS** — Maximum flexibility, enterprise-grade, complex setup.
- **Docker** — Portable, works anywhere, self-hosted option.
- **Railway** — Simple deployment, good for side projects.
- **Fly.io** — Edge deployment, good for global apps.
- **Custom** — Specify your own.

## Step 4: Confirm and Save

Present the complete stack summary in a clear table format. Ask for confirmation.

Allow the user to override any individual choice before saving.

Update the `stack` section of `.saas-playbook.yml` with all choices.

If a choice doesn't fit any preset option, store it in `stack.custom` with a descriptive key.

## Step 5: Suggest Next Steps

- If `/init` hasn't been run yet: "Run `/init` to complete project setup"
- If already initialized: "Your stack has been updated. Run `/status` to see the full project configuration"
- If auth choice was made: "Your auth provider is set to [choice]. Run `/add-auth` when ready to implement"
