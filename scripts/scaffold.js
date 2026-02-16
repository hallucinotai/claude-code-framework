#!/usr/bin/env node

/**
 * scaffold.js — CLI entry point for deterministic file scaffolding.
 *
 * Usage:
 *   node scripts/scaffold.js <handler> [--key=value ...]
 *
 * Examples:
 *   node scripts/scaffold.js init-project --name=my-app --description="My SaaS"
 *   node scripts/scaffold.js add-auth --providers=google,github --strategy=jwt
 *   node scripts/scaffold.js add-billing --provider=stripe --plans=free,pro,enterprise --trial=14
 */

const path = require('path');
const { readConfig } = require('./lib/config');
const { getCreatedFiles, resetCreatedFiles } = require('./lib/writer');

// Parse CLI arguments
const args = process.argv.slice(2);
const handlerName = args[0];

if (!handlerName) {
  console.error('Usage: node scripts/scaffold.js <handler> [--key=value ...]');
  console.error('\nAvailable handlers:');
  console.error('  init-project, add-auth, add-billing, add-multi-tenancy,');
  console.error('  add-teams, add-rbac, add-notifications, add-onboarding,');
  console.error('  add-analytics, add-page, add-api, add-model, add-component,');
  console.error('  test-setup, deploy-setup, add-ci');
  process.exit(1);
}

// Parse --key=value flags into options object
const options = {};
for (const arg of args.slice(1)) {
  if (arg.startsWith('--')) {
    const [key, ...rest] = arg.slice(2).split('=');
    let value = rest.join('=');
    // Parse comma-separated values into arrays
    if (value.includes(',')) {
      value = value.split(',').map((v) => v.trim());
    }
    // Parse boolean strings
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    // Parse numeric strings
    else if (/^\d+$/.test(value)) value = parseInt(value, 10);
    options[key] = value;
  }
}

// Add force flag
if (process.argv.includes('--force')) {
  options.force = true;
}

async function main() {
  let config = {};
  try {
    // init-project may not have a config yet
    if (handlerName !== 'init-project') {
      config = readConfig();
    }
  } catch (err) {
    if (handlerName !== 'init-project') {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  }

  // Resolve handler module
  const handlerPath = path.join(__dirname, 'handlers', `${handlerName}.js`);
  let handler;
  try {
    handler = require(handlerPath);
  } catch (err) {
    console.error(`Unknown handler: ${handlerName}`);
    console.error(`Expected file: ${handlerPath}`);
    process.exit(1);
  }

  console.log(`\n  Scaffolding: ${handlerName}\n`);
  resetCreatedFiles();

  try {
    await handler.run(options, config);
  } catch (err) {
    console.error(`\n  Error during scaffolding: ${err.message}`);
    if (process.env.DEBUG) console.error(err.stack);
    process.exit(1);
  }

  const files = getCreatedFiles();
  console.log(`\n  Done! ${files.length} file(s) created/updated.\n`);
}

main();
