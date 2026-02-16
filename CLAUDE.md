# SaaS Playbook — Claude Code Framework

This is the **SaaS Playbook** framework package. It provides a complete set of custom commands, agents, and skills to guide users through building full-stack SaaS applications using Claude Code.

## Framework Design Principles

1. **Config-driven** — Every command reads `.saas-playbook.yml` to understand the project state and generates stack-appropriate code
2. **Guided wizard pattern** — Commands prompt users step-by-step for decisions rather than requiring upfront arguments
3. **Tech-stack agnostic** — Users choose or define their own stacks; code generation adapts accordingly
4. **Modular and composable** — SaaS features are individual `/add-*` commands that can be combined freely
5. **Progressive** — Users start with `/init` and add features incrementally
6. **Idempotent** — Running a command twice updates rather than duplicates

## Package Structure

- `bin/cli.js` — NPM CLI entry point (`npx saas-playbook init`)
- `.claude/agents/` — 8 specialized AI agents for different domains
- `.claude/commands/` — 28 slash commands for the guided workflow
- `.claude/skills/` — 8 knowledge base skills for SaaS patterns and best practices
- `templates/` — Handlebars templates for code scaffolding
- `scripts/` — Deterministic scaffolding engine
- `CLAUDE.md` — This file (framework-level instructions)

## Command Lifecycle Pattern

Every command follows this flow:
1. **Read config** — Load `.saas-playbook.yml`
2. **Check prerequisites** — Verify required prior steps
3. **Gather input** — Interactive wizard questions
4. **Execute** — Scaffold files and generate code
5. **Update config** — Write choices back to config
6. **Report** — Summarize and suggest next steps

## Agent Delegation

Commands delegate complex reasoning to specialized agents:
- `saas-architect` — Overall system design
- `api-designer` — API structure and patterns
- `db-designer` — Database schema and migrations
- `ui-builder` — Frontend components and pages
- `test-engineer` — Testing strategy and implementation
- `devops-engineer` — Deployment and infrastructure
- `feature-planner` — Feature decomposition and planning
- `blueprint-architect` — Modular architecture design (existing)
