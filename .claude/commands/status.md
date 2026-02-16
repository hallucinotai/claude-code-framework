---
description: Display current SaaS project configuration, tech stack, enabled features, and progress through the development lifecycle.
allowed-tools: Read, Glob, Grep
---

# SaaS Playbook — Project Status Dashboard

You are running the `/status` command. Read the project configuration and display a comprehensive status dashboard.

## Step 1: Read Configuration

Read `.saas-playbook.yml` from the project root. If it doesn't exist, inform the user:
```
No .saas-playbook.yml found. Run /init to initialize your SaaS project.
```

## Step 2: Scan Project State

Also check for:
- Does `CLAUDE.md` exist?
- Does `package.json` (or equivalent) exist?
- What files/folders exist in the project? (quick `Glob` for top-level structure)
- Are there any `.env` or `.env.example` files?
- Is there a git repository initialized?

## Step 3: Render Dashboard

Display the status in this format:

```
╔══════════════════════════════════════════════════════╗
║              SaaS Playbook — Project Status          ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  Project: [name]                                     ║
║  Description: [description]                          ║
║  Version: [version]                                  ║
║                                                      ║
╠══════════════════════════════════════════════════════╣
║  TECH STACK                                          ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  Language:     [language]                             ║
║  Frontend:     [frontend]                             ║
║  Backend:      [backend]                              ║
║  Database:     [database]                             ║
║  ORM:          [orm]                                  ║
║  Auth:         [auth]                                 ║
║  Billing:      [billing]                              ║
║  CSS:          [css]                                  ║
║  Testing:      [unit] + [e2e]                         ║
║  Hosting:      [hosting]                              ║
║  Pkg Manager:  [package-manager]                      ║
║                                                      ║
╠══════════════════════════════════════════════════════╣
║  ARCHITECTURE                                        ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  Pattern:      [pattern]                              ║
║  API Style:    [api-style]                            ║
║                                                      ║
╠══════════════════════════════════════════════════════╣
║  SAAS FEATURES                                       ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  Auth:           [enabled/disabled] [details]         ║
║  Billing:        [enabled/disabled] [details]         ║
║  Multi-tenancy:  [enabled/disabled] [details]         ║
║  Teams:          [enabled/disabled] [details]         ║
║  RBAC:           [enabled/disabled] [details]         ║
║  Notifications:  [enabled/disabled] [details]         ║
║  Onboarding:     [enabled/disabled] [details]         ║
║  Analytics:      [enabled/disabled] [details]         ║
║                                                      ║
╠══════════════════════════════════════════════════════╣
║  PROGRESS                                            ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  [x] Initialized                                     ║
║  [ ] Architecture Designed                            ║
║  [ ] Project Scaffolded                               ║
║  [ ] Tests Setup                                      ║
║  [ ] CI/CD Setup                                      ║
║  [ ] Deployment Setup                                 ║
║  [ ] Monitoring Setup                                 ║
║                                                      ║
╠══════════════════════════════════════════════════════╣
║  DEPLOYMENT                                          ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  Provider:     [provider]                             ║
║  CI:           [ci]                                   ║
║  Containerized: [yes/no]                              ║
║  Environments: [list]                                 ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

Use checkmarks [x] for completed items and [ ] for pending. For features, show "enabled" in a positive way and "disabled" in a neutral way. Show relevant details inline (e.g., "Auth: enabled (google, github — jwt)").

For any empty/unconfigured values, show them as "not set" or "—".

## Step 4: Suggest Next Actions

Based on the current progress, suggest the most logical next command to run:

- If not initialized: "Run `/init` to get started"
- If initialized but no architecture: "Run `/architect` to design your application architecture"
- If architecture done but no features: "Run `/add-auth` to add authentication, or `/add-saas-starter` for the core SaaS bundle"
- If features enabled but not implemented: "Run `/add-[feature]` to implement [feature]"
- If features done but no tests: "Run `/test-setup` to configure testing"
- If tests done but no CI: "Run `/add-ci` to set up continuous integration"
- If CI done but no deploy: "Run `/deploy-setup` to configure deployment"
- Always mention: "Run any `/add-*` command to add more features at any time"
