---
description: Add a new API endpoint to your SaaS application with proper validation, authentication, and error handling.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Add API Endpoint

You are running the `/add-api` command. Guide the user through creating a new API endpoint.

## Step 1: Read Configuration

Read `.saas-playbook.yml` for the API style (REST/GraphQL/tRPC), backend framework, and enabled features. Scan existing API routes to understand conventions.

## Step 2: Gather Requirements

Ask the user:
1. **Endpoint path** — e.g., `/api/projects`, `/api/invoices/:id`
2. **HTTP method(s)** — GET, POST, PUT, PATCH, DELETE (or multiple for a full CRUD resource)
3. **Request body** — What data does this endpoint accept? (fields and types)
4. **Response shape** — What does this endpoint return?
5. **Authentication** — Required? What level? (any user, specific role, specific permission)
6. **Tenant-scoped?** — Should this respect multi-tenancy? (usually yes)
7. **Full CRUD resource?** — If yes, scaffold all CRUD endpoints at once

## Step 3: Scaffold

Run the scaffolding script with the user's choices:

```
node scripts/scaffold.js add-api \
  --path=<api-path> \
  --methods=<comma-separated-methods> \
  --crud=<true|false>
```

The script will create the route handler and types files at the appropriate API path. Review its output and then:
- Add request validation logic (Zod schemas for request bodies)
- Implement business logic in each handler
- Add authorization checks if RBAC is enabled
- Add tenant scoping if multi-tenancy is enabled
- Customize error handling for domain-specific errors

## Step 4: Summary

List created files, show endpoint signatures, and suggest creating corresponding UI with `/add-page` or tests with `/add-tests`.
