---
description: Run deployment to your configured hosting provider. Checks readiness and executes the deployment process.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Deploy

You are running the `/deploy` command. Check readiness and execute deployment.

## Step 1: Read Configuration

Read `.saas-playbook.yml` for deployment configuration. If not configured: "Run `/deploy-setup` first."

## Step 2: Pre-Deployment Checks

Run through a deployment checklist:

1. **Build check** — Does the project build successfully? Run the build command.
2. **Test check** — Do tests pass? Run the test suite (if configured).
3. **Environment check** — Are required environment variables set? Compare against `.env.example`.
4. **Database check** — Are migrations up to date? Check for pending migrations.
5. **Git check** — Is the working directory clean? Any uncommitted changes?

Present the checklist results to the user. If any critical checks fail, warn and ask how to proceed.

## Step 3: Select Environment

Ask: **Which environment?**
- Staging
- Production

If production, warn: "You are about to deploy to production. Please confirm."

## Step 4: Execute Deployment

Based on the hosting provider, run the appropriate deploy command:
- **Vercel**: `vercel` (staging) or `vercel --prod` (production)
- **Docker**: Build image, push to registry
- **Railway/Fly.io**: Provider CLI deploy command
- **Custom**: Run configured deploy command

## Step 5: Post-Deployment

After deployment:
1. Verify deployment is live (hit health check endpoint)
2. Run database migrations if pending
3. Report the deployed URL
4. Suggest: "Run `/add-monitoring` to set up error tracking and monitoring"
