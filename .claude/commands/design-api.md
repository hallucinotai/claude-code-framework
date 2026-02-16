---
description: Design the API endpoint structure for your SaaS application. Produces route definitions, request/response schemas, and middleware plan.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — API Structure Design

You are running the `/design-api` command. Guide the user through designing their API structure.

## Step 1: Read Configuration

Read `.saas-playbook.yml` to understand:
- API style (REST, GraphQL, tRPC)
- Backend framework
- Enabled features
- Database schema (if already designed)

Scan existing code for database models/schema files, existing route handlers, and middleware files.

## Step 2: Gather Requirements

Ask the user:
1. **Core operations** — What are the main things users do in your app? (CRUD operations on what resources?)
2. **Public vs. protected** — Which endpoints are public? Which require authentication?
3. **Real-time needs** — Do you need WebSocket/SSE for any features?
4. **External integrations** — Any third-party APIs to integrate?
5. **API consumers** — Just your frontend? Mobile apps? Third-party developers?

## Step 3: Design API Structure

Based on the API style, design the complete endpoint structure:

### For REST APIs:
Organize endpoints by resource domain:
```
# Authentication
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

# Users (protected)
GET    /api/users/me
PATCH  /api/users/me
DELETE /api/users/me

# [Domain Resource] (tenant-scoped, protected)
GET    /api/[resources]
POST   /api/[resources]
GET    /api/[resources]/:id
PATCH  /api/[resources]/:id
DELETE /api/[resources]/:id
```

### For GraphQL:
Design schema with queries, mutations, and subscriptions.

### For tRPC:
Design router structure with procedures.

## Step 4: Define Types

Create request/response type definitions:
- Request body types for POST/PUT/PATCH
- Response types for all endpoints
- Query parameter types for GET (filters, pagination)
- Shared types (pagination response, error response)

## Step 5: Design Middleware

Plan the middleware stack:
1. **Authentication** — Verify JWT/session
2. **Tenant resolution** — Extract and validate tenant context
3. **Authorization** — Check permissions for the operation
4. **Validation** — Validate request body/params
5. **Rate limiting** — Per tenant/plan limits
6. **Logging** — Request/response logging

## Step 6: Scaffold Route Files

Create the route handler files with:
- Proper imports and middleware applied
- Stub implementations that return typed responses
- Validation schemas for request bodies
- Error handling patterns
- Comments indicating where business logic goes

## Step 7: Update Config

Note API design completion in `.saas-playbook.yml`.

## Step 8: Next Steps

Suggest:
- "Start implementing endpoints — the stubs are ready for business logic"
- "Run `/add-feature` to build a complete feature across API + DB + UI"
- "Run `/test-setup` to set up API testing"
