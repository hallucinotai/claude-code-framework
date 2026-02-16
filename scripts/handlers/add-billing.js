const path = require('path');
const { renderDir } = require('../lib/renderer');
const { writeFiles, appendToFile, appendEnvVars } = require('../lib/writer');
const { pascalCase } = require('../lib/helpers');

/**
 * Scaffold billing/subscription files for Next.js + Stripe.
 * @param {object} options
 * @param {string} options.provider - Billing provider (default: stripe)
 * @param {string|string[]} options.plans - Plan names (free,pro,enterprise)
 * @param {number|boolean} options.trial - Trial days or false
 */
async function run(options, config) {
  const provider = options.provider || 'stripe';

  const plans = Array.isArray(options.plans)
    ? options.plans
    : (options.plans || 'free,pro,enterprise').split(',').map((p) => p.trim());

  const trial = options.trial === false ? false : (parseInt(options.trial, 10) || 14);

  const planDetails = plans.map((name) => ({
    name: name.toLowerCase(),
    displayName: pascalCase(name),
    upperName: name.toUpperCase(),
  }));

  const data = {
    provider,
    plans,
    planNames: plans.map((p) => p.toLowerCase()),
    planDetails,
    hasTrial: trial !== false,
    trialDays: trial || 14,
    hasFreePlan: plans.some((p) => p.toLowerCase() === 'free'),
  };

  const templateDir = path.resolve(__dirname, '../../templates/nextjs/billing');
  const outputDir = process.cwd();

  const fileMap = renderDir(templateDir, data, outputDir);

  // Remove append-mode files
  const prismaKey = Object.keys(fileMap).find((k) => k.includes('billing-models.prisma'));
  const envKey = Object.keys(fileMap).find((k) => k.includes('env.billing'));
  const prismaContent = prismaKey ? fileMap[prismaKey] : null;
  const envContent = envKey ? fileMap[envKey] : null;
  if (prismaKey) delete fileMap[prismaKey];
  if (envKey) delete fileMap[envKey];

  writeFiles(fileMap, { force: !!options.force });

  if (prismaContent) {
    const schemaPath = path.join(outputDir, 'prisma/schema.prisma');
    appendToFile(schemaPath, '\n// --- Billing Models ---\n' + prismaContent);
  }

  if (envContent) {
    const envPath = path.join(outputDir, '.env.example');
    appendEnvVars(envPath, envContent);
  }
}

module.exports = { run };
