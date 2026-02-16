---
description: Design or review the overall SaaS application architecture. Produces folder structure, module boundaries, and data flow diagrams.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Architecture Design

You are running the `/architect` command. Guide the user through designing their SaaS application architecture.

## Step 1: Read Configuration

Read `.saas-playbook.yml` to understand:
- The chosen tech stack (frontend, backend, database, ORM, etc.)
- Which SaaS features are enabled
- Current architecture settings (if any)
- Current progress state

If not initialized, inform the user: "Run `/init` first to set up your project."

## Step 2: Gather Requirements

Ask the user about:
1. **Scale expectations** — How many users/tenants do you expect in the first year? 5 years?
2. **Team size** — How many developers will work on this? Will it grow?
3. **Performance requirements** — Any specific latency or throughput needs?
4. **Integration needs** — External services, APIs, or legacy systems to integrate with?
5. **Compliance requirements** — SOC2, GDPR, HIPAA, or other compliance needs?

## Step 3: Design Architecture

Based on the stack, features, and requirements, design:

### Folder Structure
Create a detailed folder structure map appropriate for the chosen stack. For example, for a Next.js + Prisma stack:
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth-related pages (grouped)
│   ├── (dashboard)/       # Dashboard pages (protected)
│   ├── (marketing)/       # Public marketing pages
│   └── api/               # API route handlers
├── components/            # Shared UI components
│   ├── ui/                # Base UI primitives
│   ├── forms/             # Form components
│   └── layouts/           # Layout components
├── lib/                   # Core business logic
│   ├── auth/              # Authentication logic
│   ├── billing/           # Billing logic
│   ├── db/                # Database client & queries
│   └── [feature]/         # Feature-specific logic
├── middleware.ts           # Request middleware
└── types/                 # Shared TypeScript types
```

Adapt this to the chosen stack (SvelteKit would use `routes/`, Django would use `apps/`, etc.)

### Module Boundaries
Define which modules exist and their responsibilities. Each module should:
- Own its data models
- Expose a public interface
- Encapsulate its implementation details
- Communicate with other modules through defined contracts

### Data Flow
Describe how a typical request flows through the system:
1. Request → Middleware (auth, tenant resolution)
2. Route handler → Validation
3. Business logic → Database
4. Response transformation → Client

### Key Interfaces
Define the critical interfaces/contracts between modules.

## Step 4: Present and Iterate

Present the architecture to the user in a clear, visual format. Ask for feedback and iterate.

## Step 5: Scaffold

Once approved, scaffold the folder structure:
- Create all directories
- Create placeholder `index.ts` (or equivalent) files where appropriate
- Create key interface/type definition files
- Add brief comments explaining each module's purpose

## Step 6: Update Config

Update `.saas-playbook.yml`:
- Set `architecture.pattern` to the chosen pattern
- Set `progress.architecture-designed: true`

## Step 7: Next Steps

Suggest:
- "Run `/design-db` to design your database schema"
- "Run `/design-api` to design your API structure"
- If SaaS features are enabled: "Run `/add-auth` to implement authentication"
