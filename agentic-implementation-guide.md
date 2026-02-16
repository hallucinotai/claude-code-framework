# Agentic Implementation Guide

Build a full-stack SaaS application from zero to production using Claude Code and the SaaS Playbook framework. This guide walks through every stage — from project initialization to deployment — showing how commands, agents, and skills work together to accelerate development.

---

## How This Framework Works

The SaaS Playbook operates on a simple loop:

```
You describe what you want
  → A slash command runs a guided wizard
    → The wizard asks you questions
      → A scaffolding script generates boilerplate files
        → Claude customizes the generated code for your specific needs
          → Config is updated, next steps are suggested
```

Every decision you make is recorded in `.saas-playbook.yml`. Every command reads this config to understand your project's current state, stack, and enabled features before generating anything.

Three types of tools work together:

| Tool | What It Does | When It's Used |
|------|-------------|----------------|
| **Commands** (28 total) | Guided wizards that scaffold code | You invoke them with `/command-name` |
| **Agents** (8 total) | Specialized AI experts for complex reasoning | Commands delegate to them automatically |
| **Skills** (8 total) | Knowledge bases of proven SaaS patterns | Agents reference them for best practices |

---

## Stage 1: Project Setup

### 1.1 Install the Framework

```bash
mkdir petboard && cd petboard
npx saas-playbook init
```

This copies the framework files into your project:
- `.claude/commands/` — 28 slash commands
- `.claude/agents/` — 8 specialized agents
- `.claude/skills/` — 8 pattern libraries
- `scripts/` — Deterministic scaffolding engine
- `.saas-playbook.yml` — Project configuration
- `CLAUDE.md` — Project instructions for Claude

### 1.2 Initialize Your Project

Open Claude Code in the project directory and run:

```
/init
```

The init wizard walks you through:

1. **Project identity** — Name, description, and what your SaaS does
2. **Tech stack** — Pick a preset or choose each component:

   | Preset | Stack |
   |--------|-------|
   | Next.js Full-Stack | Next.js + Prisma + PostgreSQL + NextAuth + Tailwind + Vitest |
   | T3 Stack | Next.js + tRPC + Prisma + PostgreSQL + NextAuth + Tailwind |
   | SvelteKit Stack | SvelteKit + Drizzle + PostgreSQL + Lucia + Tailwind |
   | Python Stack | Django/FastAPI + SQLAlchemy + PostgreSQL + React/Vue |
   | Custom | Pick every component individually |

3. **SaaS features** — Select which modules to enable (can add later)
4. **Architecture** — Monolith, modular monolith, or microservices + API style

The command scaffolds your project structure, creates `CLAUDE.md` tailored to your stack, and initializes git.

> **PetBoard Example:** Here's what the `/init` wizard looks like for a vet clinic SaaS:
>
> ```
> /init
>
> ? Project name: petboard
> ? Description: A veterinary clinic platform where vets manage pet health
>   records, appointments, and prescriptions, and pet owners track their pets
> ? Tech stack preset: Next.js Full-Stack
>   → Next.js + Prisma + PostgreSQL + NextAuth + Tailwind + Vitest
> ? SaaS features preset: SaaS Teams (Auth + Billing + Teams + RBAC)
> ? Architecture: Modular monolith
> ? API style: REST
>
> ✓ Created .saas-playbook.yml
> ✓ Scaffolded project structure
> ✓ Created CLAUDE.md with Next.js conventions
> ✓ Initialized git repository
>
> Next steps: /architect → /design-db → /design-api
> ```

### 1.3 Check Your Status Anytime

```
/status
```

Shows your current configuration, enabled features, and what's left to set up.

---

## Stage 2: Architecture & Design

Before writing feature code, design the system. These commands delegate to specialized agents that understand SaaS patterns.

### 2.1 System Architecture

```
/architect
```

The **saas-architect** agent designs your overall system:
- Folder structure and module boundaries
- Data flow between components
- Scaling strategy and multi-tenancy approach
- Security boundaries

> **PetBoard Example:** The architect agent identifies these module boundaries:
>
> ```
> src/
> ├── modules/
> │   ├── pets/           # Pet profiles, species, breeds
> │   ├── appointments/   # Scheduling, check-ins, visit notes
> │   ├── vaccinations/   # Vaccination records, schedules, reminders
> │   ├── prescriptions/  # Medications, dosages, refills
> │   ├── health-logs/    # Weight, symptoms, lab results
> │   ├── auth/           # Authentication (scaffolded by /add-auth)
> │   ├── billing/        # Subscriptions (scaffolded by /add-billing)
> │   └── teams/          # Clinic organizations (scaffolded by /add-teams)
> ```
>
> Multi-tenancy strategy: Row-level isolation scoped to vet clinics. Vets and pet owners belong to a clinic tenant. Data flow: Owner registers pet → vet creates appointment → vet records vaccination → owner views pet health timeline.

### 2.2 Database Schema

```
/design-db
```

The **db-designer** agent creates your database schema:
- Models, relationships, and indexes
- Multi-tenant data isolation strategy
- Migration files for your ORM
- Optimized for your chosen database

> **PetBoard Example:** The db-designer produces these core models:
>
> ```prisma
> model Pet {
>   id          String   @id @default(cuid())
>   name        String
>   species     Species  // DOG, CAT, BIRD, RABBIT, OTHER
>   breed       String?
>   dateOfBirth DateTime?
>   weight      Float?   // kg
>   ownerId     String
>   owner       User     @relation("OwnerPets", fields: [ownerId], references: [id])
>   appointments Appointment[]
>   vaccinations VaccinationRecord[]
>   tenantId    String   // vet clinic - row-level isolation
> }
>
> model Appointment {
>   id          String   @id @default(cuid())
>   petId       String
>   vetId       String
>   scheduledAt DateTime
>   status      AppointmentStatus // SCHEDULED, CHECKED_IN, COMPLETED, CANCELLED
>   notes       String?
>   tenantId    String
> }
>
> model VaccinationRecord { ... } // petId, vaccine, administeredAt, nextDueDate
> model Prescription { ... }      // petId, medication, dosage, startDate, endDate
> model HealthLog { ... }         // petId, type (WEIGHT, SYMPTOM, LAB), value, recordedAt
> ```
>
> Plus indexes on `tenantId` for every tenant-scoped model, and a composite index on `(tenantId, ownerId)` for owner-filtered queries.

### 2.3 API Structure

```
/design-api
```

The **api-designer** agent plans your API:
- Route definitions and naming conventions
- Request/response schemas
- Middleware pipeline (auth, tenancy, rate limiting)
- Pagination, filtering, and error handling patterns

> **PetBoard Example:** Key endpoints designed by the api-designer:
>
> ```
> POST   /api/pets                  # Owner registers a new pet
> GET    /api/pets                  # List pets (owners see own, vets see all)
> GET    /api/pets/:id              # Get pet profile with health timeline
> PUT    /api/pets/:id              # Update pet details
>
> POST   /api/appointments          # Schedule an appointment
> GET    /api/appointments          # List appointments (filtered by role)
> PATCH  /api/appointments/:id      # Update status (check-in, complete, cancel)
>
> POST   /api/vaccinations          # Record a vaccination
> GET    /api/vaccinations/upcoming # Upcoming vaccination reminders
>
> POST   /api/prescriptions         # Vet creates a prescription
> GET    /api/prescriptions/:petId  # Get prescriptions for a pet
>
> POST   /api/health-logs           # Record weight, symptom, or lab result
> GET    /api/health-logs/:petId    # Pet health timeline
> ```
>
> Middleware pipeline: `authenticate → resolveTenant → checkPermission → rateLimit → handler`

---

## Stage 3: Core SaaS Features

This is where the framework saves the most time. Each `/add-*` command runs a guided wizard, then calls `node scripts/scaffold.js` to generate all boilerplate deterministically.

### Option A: Add Features Individually

Run commands one at a time, in dependency order:

```
/add-auth              # Authentication (required first)
/add-billing           # Subscription billing (requires auth)
/add-multi-tenancy     # Tenant isolation (requires auth)
/add-teams             # Team management (requires auth)
/add-rbac              # Role-based access control (requires auth)
/add-notifications     # Email, in-app, push notifications
/add-onboarding        # Guided user onboarding flow
/add-analytics         # Usage tracking and event analytics
```

### Option B: Use Combo Presets

Run one command to set up multiple features at once:

| Preset | Features | Best For |
|--------|----------|----------|
| `/add-saas-starter` | Auth + Billing + Multi-tenancy | Solo SaaS, single-user products |
| `/add-saas-teams` | Auth + Billing + Teams + RBAC | Team-based SaaS products |
| `/add-saas-full` | All 8 modules | Full-featured SaaS platforms |

Combo presets collect all inputs upfront, implement in dependency order, and generate cross-module integration code (middleware chains, shared types, connected UI).

### What Each Module Creates

#### `/add-auth` — Authentication
**Wizard asks**: OAuth providers, session strategy (JWT vs session), features (2FA, email verification, password reset)

**Generates**: NextAuth config, login/signup pages, middleware, form components, session provider, Prisma models (User, Account, Session), auth utility helpers

> **PetBoard Example:**
> ```
> ? OAuth providers: Google, Email/Password
> ? Session strategy: JWT
> ? Additional features: Email verification, Password reset
> ```
> Vets and pet owners both sign up via Google or email. Email verification ensures valid contact info for appointment reminders and vaccination alerts.

#### `/add-billing` — Subscription Billing
**Wizard asks**: Provider (Stripe/LemonSqueezy/Paddle), plan names and pricing, free tier, trial period, feature gating

**Generates**: Stripe SDK setup, plan definitions, webhook handler, checkout/portal API routes, pricing page, billing settings page, pricing card components, Prisma models (Subscription, Invoice)

> **PetBoard Example:**
> ```
> ? Billing provider: Stripe
> ? Plans:
>   - Free:   $0/mo  — 5 pets, basic records, no reminders
>   - Plus:  $12/mo — Unlimited pets, vaccination reminders, health timeline
>   - Clinic: $35/mo — Multi-vet, lab results, prescription management, analytics
> ? Free tier: Yes (Free plan above)
> ? Trial period: 14 days on Plus
> ? Feature gating: Yes — limit pet registrations and features by plan
> ```
> The scaffold generates plan definitions with feature limits, a pricing page with the three tiers, and middleware that checks `subscription.plan` before allowing pet registration beyond the free limit.

#### `/add-multi-tenancy` — Tenant Isolation
**Wizard asks**: Isolation strategy (row-level/schema/database), tenant identification (subdomain/path/header), terminology (organization/workspace/team)

**Generates**: Tenant resolution middleware, context provider, tenant CRUD API, settings page, tenant switcher component, Prisma models (Tenant, TenantMember)

> **PetBoard Example:**
> ```
> ? Isolation strategy: Row-level (shared database, tenantId column)
> ? Tenant identification: Path-based (/clinic/[slug]/...)
> ? Tenant terminology: Clinic
> ```
> Each vet clinic is a tenant. All pet, appointment, and health data includes a `clinicId` foreign key. The tenant middleware resolves the clinic from the URL path and injects it into the request context.

#### `/add-teams` — Team Management
**Wizard asks**: Team model (flat/hierarchical), default roles, invitation flow (email/link/both)

**Generates**: Team CRUD API, invitation system with token-based flow, teams page, member list, invite form, Prisma models (Team, TeamMember, TeamInvitation)

> **PetBoard Example:**
> ```
> ? Team model: Flat (single level — clinic organizations)
> ? Default roles: Admin, Veterinarian, Pet Owner
> ? Invitation flow: Email invite + shareable link
> ```
> Clinic admins invite veterinarians via email. Vets share invite links with pet owners to join the clinic. Each member gets a role that determines what they can see and do within the clinic.

#### `/add-rbac` — Access Control
**Wizard asks**: Model (role-based/permission-based/attribute-based), roles and permissions, resource types, UI visibility rules

**Generates**: Role-permission matrix, permission checking utilities, requirePermission middleware, PermissionGate component, RoleSelect component, seed script

> **PetBoard Example:**
> ```
> ? Access control model: Role-based
> ? Roles and permissions:
>   - Admin:        manage_clinic, manage_vets, manage_billing, view_analytics
>   - Veterinarian: create_appointment, record_vaccination, write_prescription, view_all_pets
>   - Pet Owner:    register_pet, view_own_pets, book_appointment, view_records
> ? Resource types: Pet, Appointment, VaccinationRecord, Prescription, HealthLog
> ? UI visibility: Yes — hide "Write Prescription" from pet owners
> ```
> The generated `PermissionGate` component wraps UI elements: `<PermissionGate permission="write_prescription">` hides the prescription form from pet owners while showing it to vets and admins.

#### `/add-notifications` — Notification System
**Wizard asks**: Channels (email/in-app/push/webhook), email provider (Resend/SendGrid/AWS SES), real-time updates

**Generates**: Multi-channel notification service, API endpoints, notification bell component, Prisma models (Notification), provider-specific env vars

> **PetBoard Example:**
> ```
> ? Channels: Email, In-app
> ? Email provider: Resend
> ? Real-time updates: Yes (for in-app notifications)
> ```
> Notification triggers: upcoming vaccination due (email + in-app), appointment reminder (email), appointment check-in (in-app to vet), new prescription ready (email to owner), subscription expiring (email).

#### `/add-onboarding` — User Onboarding
**Wizard asks**: Onboarding steps, checklist style, guided tour, skip option

**Generates**: Step registry, progress tracker, onboarding page with checklist, complete/skip API routes, Prisma model (OnboardingProgress)

> **PetBoard Example:**
> ```
> ? Onboarding steps:
>   1. Add your first pet (name, species, breed, date of birth)
>   2. Upload vaccination history (or start fresh)
>   3. Connect with your vet clinic (browse or enter invite code)
>   4. Book your first appointment
> ? Checklist style: Sidebar checklist with progress bar
> ? Guided tour: Yes (highlight key UI areas)
> ? Skip option: Allow skip after step 2
> ```
> New pet owners see a 4-step onboarding flow. Vets get a separate flow: create profile → set specialties and availability → review pending patients.

#### `/add-analytics` — Event Tracking
**Wizard asks**: Provider (PostHog/Mixpanel/Plausible/custom), server-side tracking, GDPR consent

**Generates**: Provider-specific analytics wrapper, AnalyticsProvider component, server-side client, typed event definitions, consent management (if GDPR)

> **PetBoard Example:**
> ```
> ? Analytics provider: PostHog
> ? Server-side tracking: Yes
> ? GDPR consent: Yes
> ```
> Tracked events: `pet_registered`, `appointment_booked`, `vaccination_recorded`, `prescription_created`, `subscription_upgraded`. Dashboard metrics: appointments per week, vaccination compliance rate, pet registrations by clinic, revenue per clinic.

---

## Stage 4: Building Your Product

With the SaaS infrastructure in place, build your actual product features.

### 4.1 Plan a Feature

```
/add-feature
```

Describe a feature in plain language. The **feature-planner** agent decomposes it into tasks across all layers:
- Database models needed
- API endpoints to create
- UI pages and components
- Business logic
- Tests

Then it implements each piece using the commands below.

> **PetBoard Example:**
> ```
> /add-feature
>
> ? Describe the feature:
>   "Vaccination tracking — vets record vaccinations for pets, set next-due dates,
>   owners get reminders when vaccinations are upcoming, and can view full history"
> ```
> The feature-planner decomposes this into:
> 1. `VaccinationRecord` model with vaccine name, date, and next-due date
> 2. `POST /api/vaccinations` and `GET /api/vaccinations/upcoming` endpoints
> 3. `/pets/[id]/vaccinations` page with vaccination timeline
> 4. `/vaccinations/upcoming` reminder dashboard page
> 5. `VaccinationCard` and `DueDateBadge` components
> 6. Tests for recording, reminder logic, and tenant isolation

### 4.2 Add Database Models

```
/add-model
```

**Wizard asks**: Model name, fields (with types, constraints, defaults), relationships, tenant scoping, soft deletes

**Generates**: Prisma schema (appended), CRUD service, TypeScript types

Field format supports compact syntax:
```
--fields="title:string:required,status:enum(draft,published):default(draft),userId:string:required"
```

> **PetBoard Example:**
> ```
> /add-model
>
> ? Model name: Pet
> ? Fields:
>   name:string:required
>   species:enum(DOG,CAT,BIRD,RABBIT,OTHER):required
>   breed:string
>   dateOfBirth:datetime
>   weight:float                   # kg
>   microchipId:string
>   notes:string
> ? Relationships: belongsTo User (as owner), hasMany Appointment, hasMany VaccinationRecord
> ? Tenant scoped: Yes (add tenantId)
> ? Soft deletes: Yes
> ```
> Generates the Prisma model, a `PetService` with `create()`, `findMany()`, `findById()`, `update()`, `delete()` — all automatically filtered by `tenantId`.

### 4.3 Add API Endpoints

```
/add-api
```

**Wizard asks**: Endpoint path, HTTP methods, request/response shape, auth level, full CRUD resource

**Generates**: Route handler with selected methods, TypeScript types

> **PetBoard Example:**
> ```
> /add-api
>
> ? Endpoint path: /api/pets
> ? Full CRUD resource: Yes (GET list, GET by id, POST, PUT, DELETE)
> ? Auth level: Protected (requires login)
> ? Additional middleware: requirePermission("register_pet") on POST, owner-only on PUT/DELETE
> ```
> Generates `app/api/pets/route.ts` (list + create) and `app/api/pets/[id]/route.ts` (get + update + delete), with tenant filtering, permission checks, and Zod validation schemas.

### 4.4 Add Pages

```
/add-page
```

**Wizard asks**: Route path, page type (public/protected/admin), data needs, layout style

**Generates**: Page component, loading skeleton, error boundary, layout (if needed)

> **PetBoard Example:** Two pages for the pet feature:
> ```
> /add-page
> ? Route path: /pets
> ? Page type: Protected
> ? Data needs: Fetch pets list with pagination
> ? Layout style: Dashboard layout with sidebar
>
> /add-page
> ? Route path: /pets/[id]
> ? Page type: Protected
> ? Data needs: Fetch single pet with health timeline
> ? Layout style: Dashboard layout with sidebar
> ```
> The list page shows pet cards in a grid with filters (species, owner). The detail page shows the pet profile with vaccination history, upcoming appointments, and a "Book Appointment" button for owners.

### 4.5 Add Components

```
/add-component
```

**Wizard asks**: Component name, props, variants (size, style), interactivity

**Generates**: Component file with typed props, test file

> **PetBoard Example:**
> ```
> /add-component
>
> ? Component name: PetCard
> ? Props:
>   - pet: Pet (required) — the pet data object
>   - onBook: () => void (optional) — callback when owner clicks "Book Appointment"
>   - showOwner: boolean (optional) — display owner name (for vet view)
> ? Variants: size (compact, full), style (default, alert)
> ? Interactivity: Click to navigate to pet profile, "Book Appointment" button
> ```
> Generates `components/PetCard.tsx` with typed props interface, responsive layout showing pet name, species icon, breed, age, weight, and next vaccination due date. Also generates `PetCard.test.tsx`.

### 4.6 Typical Feature Build Flow

For a "Pet Management" feature in PetBoard, you'd typically run:

```
/add-model          → Create the Pet model with species, breed, weight
/add-model          → Create the VaccinationRecord model with vaccine, dates
/add-api            → Create /api/pets CRUD endpoints with owner checks
/add-page           → Create /pets list page with species filters
/add-page           → Create /pets/[id] profile page with health timeline
/add-component      → Create PetCard component
/add-component      → Create VaccinationTimeline component
/add-tests          → Generate tests for pet CRUD and tenant isolation
```

Or use `/add-feature` to have the feature-planner agent orchestrate all of this from a single description like "Owners register pets with breed info, vets view all clinic pets and record vaccination history."

---

## Stage 5: Testing

### 5.1 Set Up Testing Infrastructure

```
/test-setup
```

**Wizard asks**: Coverage targets, test organization (co-located vs separate)

**Generates**: vitest.config.ts, test setup with mocks (next/navigation, next-auth), render helper with providers, user factory, db helper, example test

The **test-engineer** agent configures everything based on your stack and enabled features.

### 5.2 Generate Tests for Existing Code

```
/add-tests
```

Point it at any file, module, or feature. It analyzes the code and produces:
- Unit tests for utility functions
- Integration tests for API endpoints
- Component render tests for UI
- Multi-tenant isolation tests (if enabled)
- Billing flow tests (if enabled)

> **PetBoard Example:** Running `/add-tests` on the pets module generates:
>
> ```typescript
> // Pet CRUD with tenant isolation
> describe("PetService", () => {
>   it("creates a pet scoped to the current clinic", async () => {
>     const pet = await petService.create({
>       name: "Buddy",
>       species: "DOG",
>       breed: "Golden Retriever",
>       weight: 30.5,
>       tenantId: clinic1.id,
>     });
>     expect(pet.tenantId).toBe(clinic1.id);
>   });
>
>   it("prevents access to pets from another clinic", async () => {
>     const pet = await petService.create({ ...data, tenantId: clinic1.id });
>     await expect(
>       petService.findById(pet.id, { tenantId: clinic2.id })
>     ).resolves.toBeNull();
>   });
> });
>
> // Billing plan enforcement
> describe("Pet registration limits", () => {
>   it("allows Free plan users to register up to 5 pets", async () => {
>     await createPets(5, { plan: "free" }); // succeeds
>     await expect(
>       createPet({ plan: "free" })
>     ).rejects.toThrow("Upgrade to Plus for unlimited pets");
>   });
>
>   it("allows Plus plan users unlimited pets", async () => {
>     await createPets(50, { plan: "plus" }); // succeeds
>   });
> });
> ```

---

## Stage 6: Deployment

### 6.1 Configure Deployment

```
/deploy-setup
```

**Wizard asks**: Hosting provider (Vercel/Docker/AWS/Railway/Fly.io), environments, custom domain, database hosting

**Generates**: Provider-specific config (vercel.json, Dockerfile, docker-compose.yml), environment-specific .env templates

### 6.2 Set Up CI/CD

```
/add-ci
```

**Wizard asks**: CI provider (GitHub Actions/GitLab CI/CircleCI), pipeline stages, auto-deploy settings

**Generates**: Workflow file with lint → test → build → deploy stages, dependency caching, database service for tests

### 6.3 Add Monitoring

```
/add-monitoring
```

Sets up logging, error tracking, health checks, and observability for production.

### 6.4 Deploy

```
/deploy
```

Checks readiness and executes deployment to your configured provider.

---

## The Agent System

Commands automatically delegate to specialized agents when complex reasoning is needed. You don't call agents directly — commands route to them.

| Agent | Expertise | Used By |
|-------|-----------|---------|
| **saas-architect** | System design, scaling, multi-tenancy patterns | `/architect` |
| **api-designer** | REST/GraphQL/tRPC design, middleware, error handling | `/design-api`, `/add-api` |
| **db-designer** | Schema design, migrations, multi-tenant data modeling | `/design-db`, `/add-model` |
| **feature-planner** | Feature decomposition across all layers | `/add-feature` |
| **ui-builder** | Accessible, responsive frontend components | `/add-page`, `/add-component` |
| **test-engineer** | Test strategy, fixtures, mocking, coverage | `/test-setup`, `/add-tests` |
| **devops-engineer** | Deployment, CI/CD, containers, monitoring | `/deploy-setup`, `/add-ci`, `/deploy`, `/add-monitoring` |
| **blueprint-architect** | Modular architecture, DDD, plugin systems | Architectural decisions |

Each agent has access to the relevant **skills** (pattern libraries) for its domain, so it applies battle-tested SaaS patterns rather than generating from scratch.

---

## The Skills System

Skills are knowledge bases that agents reference. They contain proven patterns for common SaaS challenges:

| Skill | Contains |
|-------|----------|
| **saas-patterns** | Multi-tenant architecture, pricing models, tenant isolation, scaling strategies |
| **auth-patterns** | OAuth flows, session management, JWT handling, MFA, SSO |
| **billing-patterns** | Stripe/LemonSqueezy/Paddle integration, webhook handling, plan enforcement |
| **api-patterns** | REST design, pagination, rate limiting, error handling, API auth |
| **db-patterns** | Multi-tenant schemas, row-level security, migration strategies, query optimization |
| **testing-patterns** | SaaS test strategies, mocking auth/billing, tenant isolation testing |
| **deployment-patterns** | CI/CD pipelines, containerization, monitoring, zero-downtime deploys |
| **ui-ux-pro-max** | 50 design styles, 21 color palettes, 50 font pairings, responsive layouts, accessibility |

---

## The Scaffolding Engine

Behind every `/add-*` command is a deterministic scaffolding script. When you answer the wizard questions, Claude constructs a command like:

```bash
node scripts/scaffold.js add-auth \
  --providers=google,github \
  --strategy=jwt \
  --features=2fa,email-verification
```

The script reads your `.saas-playbook.yml`, renders Handlebars templates with your choices, and writes all files. Claude then reviews the output and customizes anything that requires context-specific logic.

This approach means:
- Boilerplate is generated instantly and deterministically
- Claude focuses on the parts that need intelligence (business logic, integration, customization)
- Running the same command twice produces consistent results

---

## Configuration File

`.saas-playbook.yml` is the single source of truth. Every command reads and writes to it.

```yaml
project:
  name: petboard
  description: "A veterinary clinic platform where vets manage pet health records, appointments, and prescriptions"

stack:
  frontend: nextjs
  backend: nextjs
  database: postgresql
  orm: prisma
  auth: next-auth
  css: tailwindcss
  testing:
    unit: vitest
    e2e: playwright
  hosting: vercel
  package-manager: npm
  language: typescript

features:
  auth:
    enabled: true
    providers: [google, email]
    strategy: jwt
    features: [email-verification, password-reset]
  billing:
    enabled: true
    provider: stripe
    plans:
      - name: free
        price: 0
        limits: { pets: 5, reminders: false, lab_results: false }
      - name: plus
        price: 12
        limits: { pets: unlimited, reminders: true, lab_results: false }
        trial_days: 14
      - name: clinic
        price: 35
        limits: { pets: unlimited, reminders: true, lab_results: true, multi_vet: true }
  multi-tenancy:
    enabled: true
    strategy: row-level
    identifier: path
    terminology: clinic
  teams:
    enabled: true
    model: flat
    roles: [admin, veterinarian, pet_owner]
    invitation: [email, link]
  rbac:
    enabled: true
    model: role-based
    roles:
      admin: [manage_clinic, manage_vets, manage_billing, view_analytics]
      veterinarian: [create_appointment, record_vaccination, write_prescription, view_all_pets]
      pet_owner: [register_pet, view_own_pets, book_appointment, view_records]
  notifications:
    enabled: true
    channels: [email, in-app]
    provider: resend
  onboarding:
    enabled: true
    steps: [add_first_pet, upload_vaccine_history, connect_clinic, book_appointment]
  analytics:
    enabled: true
    provider: posthog
    gdpr: true

architecture:
  pattern: modular-monolith
  api-style: rest

models:
  - Pet: { fields: [name, species, breed, dateOfBirth, weight, microchipId, notes] }
  - Appointment: { fields: [scheduledAt, status, notes, reason] }
  - VaccinationRecord: { fields: [vaccine, administeredAt, nextDueDate, batchNumber] }
  - Prescription: { fields: [medication, dosage, frequency, startDate, endDate] }
  - HealthLog: { fields: [type, value, unit, recordedAt, notes] }

progress:
  initialized: true
  architecture-designed: true
  db-designed: true
  api-designed: true
  auth: true
  billing: true
  multi-tenancy: true
  teams: true
  rbac: true
  notifications: true
  onboarding: true
  analytics: true
```

---

## Recommended Implementation Order: Building PetBoard

### Phase 1: Foundation (Day 1)
```
npx saas-playbook init     # Install framework into petboard/
/init                       # Set up PetBoard — Next.js, SaaS Teams preset
/architect                  # Design module boundaries (pets, appointments, vaccinations, prescriptions)
/design-db                  # Design Pet, Appointment, VaccinationRecord, Prescription models
/design-api                 # Plan /api/pets, /api/appointments, /api/vaccinations endpoints
```

### Phase 2: Core SaaS (Day 1-2)
```
/add-saas-teams             # Auth (Google + email) + Billing (Free/Plus/Clinic) + Teams (clinics) + RBAC
# This single command sets up:
#   - Login/signup with Google and email/password
#   - Stripe billing with 3 tiers and 14-day Plus trial
#   - Vet clinic organizations with admin/veterinarian/pet-owner roles
#   - Permission checks on all routes
```

### Phase 3: Product Features (Day 2-5)
```
/add-feature "Pet management"          # Owners register pets, vets view all clinic pets
/add-feature "Appointment scheduling"  # Owners book appointments, vets manage schedule
/add-feature "Vaccination tracking"    # Vets record vaccinations, owners get due-date reminders
/add-feature "Prescriptions"           # Vets write prescriptions, owners view medication history
/add-feature "Health timeline"         # Weight logs, symptoms, lab results in a pet timeline
```

### Phase 4: Polish (Day 5-6)
```
/add-notifications          # Vaccination reminders, appointment confirmations, prescription alerts
/add-onboarding             # Owner flow: add pet → upload history → connect clinic → book appointment
/add-analytics              # Track appointments per week, vaccination compliance, pet registrations
```

### Phase 5: Production (Day 6-7)
```
/test-setup                 # Configure Vitest with auth/billing mocks
/add-tests                  # Generate tests for pets, tenant isolation, plan limits
/deploy-setup               # Configure Vercel deployment with PostgreSQL
/add-ci                     # GitHub Actions: lint → test → build → deploy
/add-monitoring             # Error tracking, health checks, performance monitoring
/deploy                     # Ship PetBoard to production
```

---

## End-to-End Walkthrough: Building PetBoard

Here's the complete flow of building PetBoard from scratch, showing each command and what it produces.

### Day 1 Morning: Setup and Architecture

```bash
mkdir petboard && cd petboard
npx saas-playbook init
```

Open Claude Code in the `petboard/` directory:

```
/init
```
Choose: `petboard`, Next.js Full-Stack, SaaS Teams preset, modular monolith + REST. The framework scaffolds the project structure and creates `.saas-playbook.yml`.

```
/architect
```
The saas-architect agent designs module boundaries: `pets/`, `appointments/`, `vaccinations/`, `prescriptions/`, `health-logs/`, plus the SaaS modules (`auth/`, `billing/`, `teams/`). Produces a folder structure and data flow diagram.

```
/design-db
```
The db-designer creates Prisma models: `Pet`, `Appointment`, `VaccinationRecord`, `Prescription`, `HealthLog` — all with `tenantId` for clinic isolation, proper relationships, and indexes.

```
/design-api
```
The api-designer maps out all endpoints with the middleware pipeline: `authenticate → resolveTenant → checkPermission → rateLimit → handler`.

### Day 1 Afternoon: Core SaaS Infrastructure

```
/add-saas-teams
```
One command, four modules. The wizard collects all inputs upfront:
- **Auth**: Google + email/password, JWT, email verification
- **Billing**: Stripe, Free ($0) / Plus ($12) / Clinic ($35), 14-day Plus trial
- **Teams**: Clinic organizations, flat model, admin/veterinarian/pet-owner roles
- **RBAC**: Role-based, vets manage records, owners view their own pets

The scaffold generates ~40 files: auth config, login/signup pages, Stripe webhooks, pricing page, team management UI, permission middleware, and all Prisma models.

### Day 2-4: Product Features

```
/add-feature "Pet management — owners register pets with species, breed, and weight,
vets can view all clinic pets and access full health profiles"
```
The feature-planner orchestrates: creates the `Pet` model, CRUD API with owner/vet permission checks, list/profile pages, `PetCard` component, and tests.

```
/add-feature "Appointment scheduling — owners book appointments with reason and
preferred time, vets manage their schedule and record visit notes"
```
Creates `Appointment` model with status flow (scheduled → checked-in → completed), scheduling API, calendar view for vets, booking form for owners.

```
/add-feature "Vaccination tracking — vets record vaccinations with batch numbers
and set next-due dates, owners see vaccination timeline and get reminders"
```
Creates `VaccinationRecord` model, vaccination API, timeline view per pet, and upcoming reminders dashboard.

```
/add-feature "Prescription management — vets write prescriptions with medication,
dosage, and duration, owners view active and past prescriptions"
```
Creates `Prescription` model, prescription API, prescription form for vets, medication list for owners.

```
/add-feature "Health timeline — vets record weight, symptoms, and lab results,
owners see a chronological health log for each pet"
```
Creates `HealthLog` model with polymorphic type (weight/symptom/lab), timeline API endpoint, and a visual health timeline component.

### Day 5: Polish

```
/add-notifications
```
Set up Resend for email, in-app notifications for real-time. Configure triggers: vaccination due soon, appointment reminder, prescription ready, new lab results available, subscription expiring.

```
/add-onboarding
```
Pet owner onboarding: add first pet → upload vaccination history → connect to vet clinic → book first appointment. Vet onboarding: create profile → set specialties and availability → review pending patients.

```
/add-analytics
```
PostHog integration with GDPR consent. Track `pet_registered`, `appointment_booked`, `vaccination_recorded`, `prescription_created`, `subscription_upgraded`.

### Day 6-7: Testing and Deployment

```
/test-setup
```
Configures Vitest with mocked NextAuth sessions, Stripe test helpers, and tenant context utilities. Creates factory functions for `createPet()`, `createUser()`, `createClinic()`.

```
/add-tests
```
Run for each module. Generates tenant isolation tests (clinic A can't see clinic B's pets), billing enforcement tests (Free plan limited to 5 pets), RBAC tests (owners can't write prescriptions), and API integration tests.

```
/deploy-setup
```
Configure Vercel with PostgreSQL on Railway, set up environment variables for Stripe, Resend, PostHog.

```
/add-ci
```
GitHub Actions workflow: install → lint → test (with PostgreSQL service) → build → deploy to Vercel on merge to main.

```
/add-monitoring
```
Sentry for error tracking, health check endpoint at `/api/health`, structured logging.

```
/deploy
```
Checks readiness (all tests pass, env vars set, database migrated) and deploys PetBoard to production.

---

## Tips for Effective Use

1. **Run `/status` often** — It shows what's configured and what's missing.

2. **Follow dependency order** — Auth must come before billing. Billing before feature gating. The commands will tell you if prerequisites are missing.

3. **Customize after scaffolding** — The scripts generate solid boilerplate. Claude then helps you customize it. Focus your time on business logic, not infrastructure.

4. **Use combo presets for new projects** — `/add-saas-starter` or `/add-saas-teams` sets up the foundation faster than running commands individually.

5. **Use `/add-feature` for product features** — Instead of manually running model → api → page → component, describe the feature and let the planner orchestrate it.

6. **Config is king** — If something seems wrong, check `.saas-playbook.yml`. Every command reads it. Fixing the config fixes the behavior.

7. **Commands are idempotent** — Running a command again updates rather than duplicates. Safe to re-run if you change your mind about options.

8. **Agents have specialties** — When a command delegates to an agent, that agent has deep knowledge of its domain. Trust its suggestions for architecture, schema design, and patterns.
