---
description: Add a guided user onboarding flow to your SaaS project. Includes step tracking, progress checklists, and welcome screens.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — User Onboarding Module

You are running the `/add-onboarding` command. Guide the user through adding an onboarding flow.

## Step 1: Read Configuration

Read `.saas-playbook.yml` for stack and enabled features.

## Step 2: Onboarding Configuration

Ask the user:
1. **Onboarding steps** — What steps should new users complete?
   - Welcome/intro screen
   - Profile setup (name, avatar, preferences)
   - Team/workspace creation (if teams enabled)
   - First core action (create first project, invite first member, etc.)
   - Feature tutorial/guided tour
   - Custom steps?
2. **Checklist style?** — Show a progress checklist in the dashboard?
3. **Guided tour?** — Tooltip-based tour pointing to UI elements?
4. **Skip option?** — Can users skip onboarding?
5. **Role-specific?** — Different onboarding for different user types (admin vs member, invited vs signed up)?

## Step 3: Scaffold

Run the scaffolding script with the user's choices:

```
node scripts/scaffold.js add-onboarding \
  --steps=<comma-separated-steps> \
  --checklist=<true|false> \
  --guidedTour=<true|false>
```

The script will create all onboarding boilerplate (step registry, progress tracking, onboarding page with checklist, complete/skip API routes, Prisma model). Review its output and then:
- Customize the step content and UI for the specific product
- Wire up redirect from signup to onboarding flow
- Add checklist component to dashboard if selected
- Add analytics tracking for onboarding events if analytics is enabled

## Step 4: Update Config

Update `.saas-playbook.yml`:
- Set `features.onboarding.enabled: true`
- Set `features.onboarding.steps`

## Step 5: Summary

List created files and suggest customizing step content for the specific product.
