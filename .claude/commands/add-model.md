---
description: Add a new database model with fields, relationships, and migration file based on your ORM.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Add Database Model

You are running the `/add-model` command. Guide the user through creating a new database model.

## Step 1: Read Configuration

Read `.saas-playbook.yml` for the database, ORM, and enabled features. Read existing schema files to understand conventions.

## Step 2: Gather Requirements

Ask the user:
1. **Model name** — e.g., Project, Document, Invoice (singular, PascalCase)
2. **Fields** — What data does this model store? For each field:
   - Name and type (string, number, boolean, date, enum, JSON, etc.)
   - Required or optional?
   - Default value?
   - Unique constraint?
3. **Relationships** — Does this relate to other models?
   - Belongs to (foreign key)
   - Has many
   - Many-to-many
4. **Tenant-scoped?** — Should this model have a `tenant_id`? (yes for most SaaS data)
5. **Soft deletes?** — Use a `deletedAt` timestamp instead of hard delete?
6. **Timestamps?** — Include `createdAt`, `updatedAt`? (recommended: yes)

## Step 3: Generate

Run the scaffolding script with the user's choices:

```
node scripts/scaffold.js add-model \
  --name=<ModelName> \
  --fields="<field:type:constraints,...>" \
  --relations=<comma-separated-relations>
```

Field format: `title:string:required,status:enum(draft,published):default(draft),userId:string:required`

The script will create the Prisma model (appended to schema.prisma), a CRUD service file, and TypeScript types. Review its output and then:
- Verify the generated Prisma model fields and relations
- Add any custom indexes or constraints
- Customize the CRUD service with business-specific logic
- Run `npx prisma migrate dev` to generate the migration

## Step 4: Summary

Show the generated model, migration, and CRUD utilities. Suggest `/add-api` to create endpoints or `/add-page` to create UI.
