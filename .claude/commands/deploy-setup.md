---
description: Configure deployment for your SaaS application. Sets up hosting provider, environment management, and deployment scripts.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Deployment Setup

You are running the `/deploy-setup` command. Guide the user through configuring deployment.

## Step 1: Read Configuration

Read `.saas-playbook.yml` for hosting target and stack. If hosting isn't set, ask the user to choose.

## Step 2: Gather Requirements

Ask the user:
1. **Hosting provider** — Vercel, AWS, Docker, Railway, Fly.io, custom
2. **Environments** — Which environments? (development, staging, production)
3. **Custom domain** — Do you have a custom domain?
4. **Database hosting** — Where is the database? (Supabase, PlanetScale, Neon, AWS RDS, Railway)
5. **Containerization** — Docker needed? (required for some providers)

## Step 3: Scaffold

Run the scaffolding script with the user's choices:

```
node scripts/scaffold.js deploy-setup \
  --provider=<vercel|docker|aws|railway|flyio> \
  --environments=<comma-separated-environments>
```

The script will create all deployment configuration (provider-specific config files, Dockerfile if Docker, docker-compose.yml, environment-specific .env templates). Review its output and then:
- Customize environment variables for each environment
- Configure domain settings and SSL for production
- Add deployment scripts to `package.json` if not already present
- Set up health check endpoint in the application

## Step 5: Update Config

Update `.saas-playbook.yml`:
- Set `deployment.provider`, `deployment.containerized`, `deployment.environments`
- Set `progress.deploy-setup: true`

## Step 6: Summary

List config files created, required environment variables, and suggest running `/add-ci` to automate deployments.
