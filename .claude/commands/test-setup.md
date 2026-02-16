---
description: Configure testing infrastructure for your SaaS project. Sets up test runner, utilities, fixtures, and example tests.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Testing Setup

You are running the `/test-setup` command. Guide the user through setting up testing infrastructure.

## Step 1: Read Configuration

Read `.saas-playbook.yml` for:
- Testing frameworks (unit: Vitest/Jest/pytest, e2e: Playwright/Cypress)
- Tech stack (affects testing patterns)
- Enabled features (affects what needs testing)

If testing frameworks aren't configured, ask the user to choose or recommend based on stack.

## Step 2: Gather Preferences

Ask the user:
1. **Coverage targets** — What code coverage percentage? (recommend 80% for business logic)
2. **Test organization** — Co-located with source (recommended) or separate test directory?
3. **E2E scope** — Which critical flows need E2E tests?

## Step 3: Scaffold

Run the scaffolding script with the user's choices:

```
node scripts/scaffold.js test-setup \
  --coverage=<percentage> \
  --organization=<colocated|separate>
```

The script will create all testing infrastructure (vitest.config.ts, test setup file with mocks, render helper with providers, user factory, db helper, and an example test). Review its output and then:
- Customize the test setup file with project-specific mocks
- Add factories for your domain models
- Add test scripts to `package.json` if not already present
- Configure any additional mock utilities for external services

## Step 7: Update Config

Set `progress.tests-setup: true` in `.saas-playbook.yml`.

## Step 8: Summary

List all created files, explain test organization, and suggest running `/add-tests` to generate tests for existing code.
