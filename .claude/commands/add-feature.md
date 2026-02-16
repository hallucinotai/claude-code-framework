---
description: Scaffold a new feature across all application layers (database, API, business logic, UI, tests) with guided planning.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Add Feature

You are running the `/add-feature` command. Guide the user through planning and scaffolding a complete feature.

## Step 1: Read Configuration

Read `.saas-playbook.yml` for stack, architecture, and enabled features. Scan the existing codebase to understand current patterns and conventions.

## Step 2: Gather Feature Requirements

Ask the user:
1. **Feature name** — What is this feature called? (e.g., "file-uploads", "project-templates", "team-billing")
2. **Description** — What does this feature do from the user's perspective?
3. **Affected layers** — Which layers does this touch? (ask or infer)
   - Database (new models/tables?)
   - API (new endpoints?)
   - Business logic (new services?)
   - UI (new pages/components?)
   - Tests
4. **User stories** — What are the key user actions? (e.g., "User can upload a file", "User can view uploaded files")
5. **SaaS considerations**:
   - Tenant-scoped? (usually yes)
   - Plan-gated? (available only on certain plans?)
   - Role-restricted? (only certain roles can access?)

## Step 3: Plan

Decompose the feature into specific implementation tasks across all layers. Present the plan organized by layer:

### Database Layer
- Models to create or modify
- Migrations needed
- Indexes for query patterns

### API Layer
- Endpoints to create
- Request/response types
- Middleware requirements

### Business Logic
- Service functions
- Validation rules
- Error handling

### UI Layer
- Pages/routes to create
- Components needed
- Forms and interactions

### Tests
- Unit tests for services
- API integration tests
- E2E test scenarios

Present the plan to the user for approval before proceeding.

## Step 4: Scaffold

Once approved, scaffold all layers following the project's existing conventions:
- Create files in the correct directories
- Follow existing naming patterns
- Apply tenant scoping if multi-tenancy is enabled
- Apply permission checks if RBAC is enabled
- Apply plan gating if billing is enabled
- Include proper error handling
- Add loading and error states in UI

## Step 5: Update Config

Add the feature to `progress.features` in `.saas-playbook.yml` as `in-progress`.

## Step 6: Summary

List all files created, summarize the feature structure, and suggest:
- "Run `/add-tests` to generate comprehensive tests for this feature"
- "Implement the TODO comments in the scaffolded files"
