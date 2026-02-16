---
description: Add a new page or route to your SaaS application with proper layout, data fetching, and protection.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Add Page

You are running the `/add-page` command. Guide the user through creating a new page.

## Step 1: Read Configuration

Read `.saas-playbook.yml` for the frontend framework, CSS approach, and enabled features. Scan existing pages to understand conventions.

## Step 2: Gather Requirements

Ask the user:
1. **Route path** — What URL should this page be at? (e.g., `/dashboard`, `/settings/billing`, `/projects/:id`)
2. **Page type**:
   - **Public** — No authentication required (marketing, docs)
   - **Protected** — Requires authentication (dashboard, settings)
   - **Admin** — Requires admin role
3. **Page purpose** — What does this page display or do?
4. **Data needs** — What data does this page need to fetch?
5. **Layout** — Use existing layout or need a new one? (sidebar, full-width, centered)

## Step 3: Scaffold

Run the scaffolding script with the user's choices:

```
node scripts/scaffold.js add-page \
  --route=<route-path> \
  --type=<public|protected|admin> \
  --layout=<sidebar|full-width|centered>
```

The script will create page files at the appropriate route directory (page.tsx, loading.tsx, error.tsx, and layout.tsx if needed). Review its output and then:
- Add page-specific data fetching logic
- Customize the page content and layout for the specific use case
- Add SEO metadata (title, description)
- Wire up any needed API calls or components

## Step 4: Summary

Show created files and suggest related commands (`/add-component` for reusable pieces, `/add-api` if new endpoints are needed).
