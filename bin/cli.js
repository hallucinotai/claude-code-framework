#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const CONFIG_FILE = ".saas-playbook.yml";
const CLAUDE_DIR = ".claude";
const SKILLS_DIR = "skills";
const SCRIPTS_DIR = "scripts";
const CLAUDE_MD = "CLAUDE.md";

const targetDir = process.cwd();
const packageRoot = path.resolve(__dirname, "..");

function copyDirRecursive(src, dest, exclude = []) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (exclude.includes(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function main() {
  const command = process.argv[2];

  if (command !== "init") {
    console.log(`
  saas-playbook - Claude Code playbook for building SaaS applications

  Usage:
    npx saas-playbook init    Initialize SaaS Playbook in the current directory

  After initialization, open Claude Code and run /init to start the guided wizard.
`);
    process.exit(0);
  }

  // Check if already initialized
  if (fs.existsSync(path.join(targetDir, CONFIG_FILE))) {
    console.log(
      "\n  SaaS Playbook is already initialized in this directory."
    );
    console.log(
      '  Run /init in Claude Code to reconfigure, or /status to see current state.\n'
    );
    process.exit(1);
  }

  console.log("\n  Initializing SaaS Playbook...\n");

  // Copy .claude directory (agents + commands), excluding local settings
  const srcClaude = path.join(packageRoot, CLAUDE_DIR);
  const destClaude = path.join(targetDir, CLAUDE_DIR);
  if (fs.existsSync(srcClaude)) {
    copyDirRecursive(srcClaude, destClaude, ["settings.local.json"]);
    console.log("  [+] Copied .claude/ (agents + commands)");
  }

  // Copy skills directory
  const srcSkills = path.join(packageRoot, SKILLS_DIR);
  const destSkills = path.join(targetDir, SKILLS_DIR);
  if (fs.existsSync(srcSkills)) {
    copyDirRecursive(srcSkills, destSkills);
    console.log("  [+] Copied skills/ (knowledge base)");
  }

  // Copy scripts directory (scaffolding engine)
  const srcScripts = path.join(packageRoot, SCRIPTS_DIR);
  const destScripts = path.join(targetDir, SCRIPTS_DIR);
  if (fs.existsSync(srcScripts)) {
    copyDirRecursive(srcScripts, destScripts);
    console.log("  [+] Copied scripts/ (scaffolding engine)");
  }

  // Copy templates directory (Handlebars templates for scaffolding)
  const srcTemplates = path.join(packageRoot, "templates");
  const destTemplates = path.join(targetDir, "templates");
  if (fs.existsSync(srcTemplates)) {
    copyDirRecursive(srcTemplates, destTemplates);
    console.log("  [+] Copied templates/ (scaffolding templates)");
  }

  // Copy config template
  const srcConfig = path.join(packageRoot, "templates", "saas-playbook.yml");
  const destConfig = path.join(targetDir, CONFIG_FILE);
  if (fs.existsSync(srcConfig)) {
    fs.copyFileSync(srcConfig, destConfig);
    console.log("  [+] Created .saas-playbook.yml (project config)");
  }

  // Create .gitignore
  const destGitignore = path.join(targetDir, ".gitignore");
  if (!fs.existsSync(destGitignore)) {
    const gitignoreContent = `# Dependencies
node_modules/
/.pnp
.pnp.js
.yarn/install-state.gz

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Prisma
prisma/dev.db
prisma/dev.db-journal
`;
    fs.writeFileSync(destGitignore, gitignoreContent);
    console.log("  [+] Created .gitignore");
  } else {
    console.log("  [~] .gitignore already exists, skipping");
  }

  // Copy agentic implementation guide
  const srcGuide = path.join(packageRoot, "agentic-implementation-guide.md");
  const destGuide = path.join(targetDir, "agentic-implementation-guide.md");
  if (fs.existsSync(srcGuide)) {
    fs.copyFileSync(srcGuide, destGuide);
    console.log("  [+] Copied agentic-implementation-guide.md");
  }

  // Create initial CLAUDE.md
  const claudeMdContent = `# SaaS Playbook Project

This project uses the **SaaS Playbook** framework for Claude Code.

## Getting Started

Run \`/init\` in Claude Code to start the guided project setup wizard. This will:
1. Set your project name and description
2. Select your tech stack
3. Choose which SaaS features to enable
4. Scaffold the initial project structure

## Available Commands

### Project Setup
- \`/init\` — Master project setup wizard
- \`/tech-stack\` — Select or modify your technology stack
- \`/status\` — View project configuration and progress

### Architecture
- \`/architect\` — Design overall application architecture
- \`/design-db\` — Design database schema
- \`/design-api\` — Design API structure

### SaaS Modules
- \`/add-auth\` — Add authentication
- \`/add-billing\` — Add subscription billing
- \`/add-multi-tenancy\` — Add multi-tenancy
- \`/add-teams\` — Add team/org management
- \`/add-rbac\` — Add role-based access control
- \`/add-notifications\` — Add notification system
- \`/add-onboarding\` — Add user onboarding flow
- \`/add-analytics\` — Add analytics tracking

### Combo Presets
- \`/add-saas-starter\` — Auth + Billing + Multi-tenancy
- \`/add-saas-teams\` — Auth + Billing + Teams + RBAC
- \`/add-saas-full\` — All SaaS modules

### Build
- \`/add-feature\` — Scaffold a new feature across all layers
- \`/add-page\` — Add a new page/route
- \`/add-api\` — Add a new API endpoint
- \`/add-model\` — Add a new database model
- \`/add-component\` — Add a new UI component

### Quality
- \`/test-setup\` — Configure testing infrastructure
- \`/add-tests\` — Generate tests for a file or module

### Deployment
- \`/deploy-setup\` — Configure deployment target
- \`/add-ci\` — Set up CI/CD pipeline
- \`/deploy\` — Run deployment

### Operations
- \`/add-monitoring\` — Add logging and monitoring

## Configuration

All project configuration is stored in \`.saas-playbook.yml\`. Every command reads and updates this file to maintain consistency across the project.
`;

  const destClaudeMd = path.join(targetDir, CLAUDE_MD);
  if (!fs.existsSync(destClaudeMd)) {
    fs.writeFileSync(destClaudeMd, claudeMdContent);
    console.log("  [+] Created CLAUDE.md (project instructions)");
  } else {
    console.log("  [~] CLAUDE.md already exists, skipping");
  }

  console.log(`
  SaaS Playbook initialized successfully!

  Next steps:
    1. Open Claude Code in this directory
    2. Run /init to start the guided project setup wizard
    3. Follow the prompts to configure your SaaS project

  Tip: Run /status at any time to see your project configuration and progress.
`);
}

main();
