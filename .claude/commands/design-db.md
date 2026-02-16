---
description: Design the database schema for your SaaS application. Creates models, relationships, and migration files based on your tech stack.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Database Schema Design

You are running the `/design-db` command. Guide the user through designing their database schema.

## Step 1: Read Configuration

Read `.saas-playbook.yml` to understand:
- Database type (PostgreSQL, MySQL, MongoDB, SQLite)
- ORM choice (Prisma, Drizzle, TypeORM, SQLAlchemy, etc.)
- Enabled features (auth, billing, multi-tenancy, teams, RBAC, etc.)
- Architecture pattern

If the database or ORM isn't set, ask the user to run `/tech-stack` first or specify them now.

## Step 2: Understand Domain

Ask the user:
1. **Core entities** — What are the main data objects in your application? (e.g., projects, tasks, documents, products)
2. **Relationships** — How do these entities relate to each other?
3. **Key operations** — What are the most common queries? (reads vs writes ratio)
4. **Data volume** — Expected data size and growth rate?

## Step 3: Design Schema

Design the schema considering all enabled features. Include these base tables when their features are enabled:

### Auth tables (if auth enabled)
- `users` — Core user identity
- `accounts` — OAuth provider accounts
- `sessions` — Active sessions
- `verification_tokens` — Email verification, password reset

### Billing tables (if billing enabled)
- `subscriptions` — Active subscriptions
- `plans` — Available subscription plans
- `invoices` — Payment history
- `payment_methods` — Stored payment methods

### Multi-tenancy tables (if multi-tenancy enabled)
- `tenants` / `organizations` — Tenant entities
- `tenant_members` — User-tenant relationships
- Add `tenant_id` foreign key to all tenant-scoped tables

### Team tables (if teams enabled)
- `teams` — Team entities within tenants
- `team_members` — User-team relationships
- `invitations` — Pending team invitations

### RBAC tables (if RBAC enabled)
- `roles` — Role definitions
- `permissions` — Permission definitions
- `role_permissions` — Role-permission mappings
- `user_roles` — User-role assignments

### Domain tables
- User-specified domain entities with proper relationships

## Step 4: Present Schema

Present the schema in an ERD-style text format showing:
- All tables with their columns and types
- Primary keys, foreign keys, and unique constraints
- Indexes for common query patterns
- Relationships between tables

## Step 5: Generate Files

Generate the schema files using the project's ORM:
- For **Prisma**: Write `prisma/schema.prisma` with all models
- For **Drizzle**: Write schema files in `src/lib/db/schema/`
- For **TypeORM**: Write entity files in `src/entities/`
- For **SQLAlchemy**: Write model files in `app/models/`
- For **Sequelize**: Write model files in `src/models/`

Also generate:
- Initial migration file
- Seed data file for development
- Database client/connection setup

## Step 6: Update Config

Update `.saas-playbook.yml` with any new information about the database design.

## Step 7: Next Steps

Suggest:
- "Run `/design-api` to design API endpoints for these models"
- "Run `/add-model` to add additional models later"
- If features need implementation: "Run `/add-[feature]` to implement [feature]"
