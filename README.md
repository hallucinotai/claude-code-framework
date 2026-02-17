# SaaS Playbook

A **Claude Code framework** for building full-stack SaaS applications. Provides guided wizards, specialized agents, and domain-specific skills to take you from project initialization through deployment and monitoring.

[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-GitHub%20Sponsors-ea4aaa?logo=github)](https://github.com/sponsors/hallucinotai)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/hallucinotai)

## What is this?

SaaS Playbook is an NPM package that installs into your project and gives Claude Code a complete set of custom `/` commands, AI agents, and knowledge skills for building SaaS applications. Instead of starting from scratch, you get an opinionated-but-flexible framework that guides you through every phase of SaaS development.

### Key Features

- **Guided wizard pattern** — Commands prompt you step-by-step for decisions, no upfront config needed
- **Tech-stack agnostic** — Works with Next.js, SvelteKit, Django, Rails, or any custom stack
- **Modular SaaS features** — Add auth, billing, multi-tenancy, teams, RBAC, etc. individually or as combos
- **Full lifecycle** — From `npx saas-playbook init` to `/deploy` and `/add-monitoring`
- **Config-driven** — `.saas-playbook.yml` is the single source of truth; all commands read and update it

## Quick Start

```bash
# In a new or existing project directory
npx saas-playbook init

# Open Claude Code
claude

# Run the setup wizard
/init

# Check your project status anytime
/status
```

## Available Commands

### Project Setup
| Command | Description |
|---------|-------------|
| `/init` | Master project setup wizard |
| `/tech-stack` | Select or modify technology stack |
| `/status` | View project configuration and progress |

### Architecture
| Command | Description |
|---------|-------------|
| `/architect` | Design application architecture |
| `/design-db` | Design database schema |
| `/design-api` | Design API structure |

### SaaS Modules
| Command | Description |
|---------|-------------|
| `/add-auth` | Authentication (OAuth, email, magic link) |
| `/add-billing` | Subscription billing (Stripe, etc.) |
| `/add-multi-tenancy` | Tenant isolation |
| `/add-teams` | Team/org management |
| `/add-rbac` | Role-based access control |
| `/add-notifications` | Email, in-app, push notifications |
| `/add-onboarding` | User onboarding flow |
| `/add-analytics` | Analytics tracking |

### Combo Presets
| Command | Includes |
|---------|----------|
| `/add-saas-starter` | Auth + Billing + Multi-tenancy |
| `/add-saas-teams` | Auth + Billing + Teams + RBAC |
| `/add-saas-full` | All 8 SaaS modules |

### Build
| Command | Description |
|---------|-------------|
| `/add-feature` | Scaffold a feature across all layers |
| `/add-page` | Add a new page/route |
| `/add-api` | Add a new API endpoint |
| `/add-model` | Add a new database model |
| `/add-component` | Add a new UI component |

### Quality & Deploy
| Command | Description |
|---------|-------------|
| `/test-setup` | Configure testing infrastructure |
| `/add-tests` | Generate tests for existing code |
| `/deploy-setup` | Configure deployment target |
| `/add-ci` | Set up CI/CD pipeline |
| `/deploy` | Run deployment |
| `/add-monitoring` | Add logging and monitoring |

## Specialized Agents

SaaS Playbook includes specialized AI agents that handle domain-specific tasks:

| Agent | Specialty |
|-------|-----------|
| `saas-architect` | System design, scaling, multi-tenancy |
| `api-designer` | API design (REST, GraphQL, tRPC) |
| `db-designer` | Database schemas, migrations |
| `ui-builder` | Frontend components, accessibility |
| `feature-planner` | Feature decomposition |
| `test-engineer` | Testing strategy and implementation |
| `devops-engineer` | Deployment, CI/CD, monitoring |
| `blueprint-architect` | Modular architecture design |

## Skills (Knowledge Base)

Built-in knowledge for SaaS best practices:

- **saas-patterns** — Multi-tenant architecture, pricing models, scaling
- **auth-patterns** — OAuth, JWT, sessions, MFA, SSO
- **billing-patterns** — Stripe integration, webhooks, subscriptions
- **api-patterns** — REST, GraphQL, pagination, rate limiting
- **db-patterns** — Row-level security, migrations, indexing
- **testing-patterns** — Test pyramid, factories, mocking
- **deployment-patterns** — Docker, CI/CD, monitoring
- **ui-ux-pro-max** — 50 design styles, 21 color palettes, 50 font pairings, responsive layouts, accessibility

## Configuration

All project configuration lives in `.saas-playbook.yml` at your project root. Every command reads and updates this file. It tracks:

- Project metadata (name, description, version)
- Tech stack choices
- Enabled SaaS features with their configuration
- Architecture decisions
- Deployment settings
- Progress through the development lifecycle

## Supported Tech Stacks

### Preset Combinations
- **Next.js Full-Stack** — Next.js + Prisma + PostgreSQL + NextAuth + Tailwind
- **T3 Stack** — Next.js + tRPC + Prisma + PostgreSQL + NextAuth + Tailwind
- **SvelteKit Stack** — SvelteKit + Drizzle + PostgreSQL + Lucia + Tailwind
- **Python Stack** — Django/FastAPI + SQLAlchemy + PostgreSQL + React/Vue

### Or pick your own
Every component can be individually selected or customized. The framework adapts code generation to your specific stack.

## How It Works

1. **`npx saas-playbook init`** copies the framework files into your project
2. **`/init`** in Claude Code runs the setup wizard to configure your project
3. **`/add-*` commands** scaffold features with code tailored to your stack
4. **Agents** handle complex design tasks (architecture, API design, UI/UX, etc.)
5. **Skills** provide domain knowledge for high-quality code generation and design
6. **`.saas-playbook.yml`** keeps everything in sync across commands

## License

MIT
