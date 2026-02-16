---
description: Add a new reusable UI component with proper typing, accessibility, and optional test/story file.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Add UI Component

You are running the `/add-component` command. Guide the user through creating a new reusable UI component.

## Step 1: Read Configuration

Read `.saas-playbook.yml` for the frontend framework, CSS approach, and testing setup. Scan existing components to understand naming conventions and file structure.

## Step 2: Gather Requirements

Ask the user:
1. **Component name** — e.g., DataTable, UserAvatar, PricingCard (PascalCase)
2. **Purpose** — What does this component do?
3. **Props** — What configuration does it accept?
   - Required props with types
   - Optional props with defaults
4. **Variants** — Does it have visual variants? (size: sm/md/lg, variant: default/outline/ghost)
5. **Interactive?** — Does it handle user interactions? (clicks, form input, etc.)
6. **Composition** — Does it compose other existing components?

## Step 3: Scaffold

Run the scaffolding script with the user's choices:

```
node scripts/scaffold.js add-component \
  --name=<ComponentName> \
  --props=<comma-separated-props> \
  --variants=<comma-separated-variants>
```

The script will create the component file and test file in `components/`. Review its output and then:
- Implement the component's rendering logic and markup
- Add accessible attributes (ARIA, keyboard handling)
- Customize variant styles using the project's CSS approach
- Add loading/error/empty state variants as needed

## Step 4: Summary

Show created files, usage example with props, and available variants.
