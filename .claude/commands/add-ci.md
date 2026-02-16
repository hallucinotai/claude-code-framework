---
description: Set up CI/CD pipeline for automated testing, building, and deployment of your SaaS application.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — CI/CD Pipeline Setup

You are running the `/add-ci` command. Guide the user through setting up CI/CD.

## Step 1: Read Configuration

Read `.saas-playbook.yml` for CI preference, hosting provider, and testing setup.

## Step 2: Gather Preferences

Ask the user:
1. **CI provider** — GitHub Actions (recommended), GitLab CI, CircleCI
2. **Pipeline triggers** — On push to main? On pull request? On tag?
3. **Pipeline stages** — Lint, test, build, deploy (which ones?)
4. **Auto-deploy** — Auto-deploy staging on merge to main? Production on tag?
5. **Preview deployments** — Deploy PR previews?

## Step 3: Scaffold

Run the scaffolding script with the user's choices:

```
node scripts/scaffold.js add-ci \
  --provider=<github-actions|gitlab-ci|circleci> \
  --stages=<comma-separated-stages> \
  --autoDeploy=<true|false>
```

The script will create the CI/CD pipeline configuration (workflow file with selected stages, dependency caching, database service for tests, and deployment steps). Review its output and then:
- Configure required secrets in the CI provider (API keys, deploy tokens)
- Customize deployment steps for the specific hosting provider
- Set up branch protection rules if needed
- Add any project-specific CI steps (e.g., security scanning, performance tests)

## Step 5: Update Config

Set `deployment.ci` and `progress.ci-setup: true` in `.saas-playbook.yml`.

## Step 6: Summary

Show pipeline config, required secrets to configure, and suggest `/deploy` when ready.
