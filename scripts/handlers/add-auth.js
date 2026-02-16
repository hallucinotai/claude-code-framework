const path = require('path');
const { renderDir, render } = require('../lib/renderer');
const { writeFiles, appendToFile, appendEnvVars } = require('../lib/writer');

/**
 * Scaffold authentication files for Next.js + NextAuth.js.
 * @param {object} options
 * @param {string|string[]} options.providers - OAuth providers (google,github,credentials)
 * @param {string} options.strategy - jwt or session
 * @param {string|string[]} options.features - Additional features (2fa,password-reset,email-verification)
 */
async function run(options, config) {
  const providers = Array.isArray(options.providers)
    ? options.providers
    : (options.providers || 'credentials').split(',').map((p) => p.trim());

  const features = Array.isArray(options.features)
    ? options.features
    : (options.features || '').split(',').map((f) => f.trim()).filter(Boolean);

  const strategy = options.strategy || 'jwt';

  const data = {
    providers,
    strategy,
    features,
    hasPasswordReset: features.includes('password-reset'),
    hasEmailVerification: features.includes('email-verification'),
    has2FA: features.includes('2fa'),
    hasSSO: features.includes('sso'),
    hasCredentials: providers.includes('credentials'),
    hasGoogle: providers.includes('google'),
    hasGithub: providers.includes('github'),
    hasDiscord: providers.includes('discord'),
  };

  const templateDir = path.resolve(__dirname, '../../templates/nextjs/auth');
  const outputDir = process.cwd();

  // Render main templates (excluding append-mode files)
  const fileMap = renderDir(templateDir, data, outputDir);

  // Remove append-mode files from the write map
  const prismaKey = Object.keys(fileMap).find((k) => k.includes('auth-models.prisma'));
  const envKey = Object.keys(fileMap).find((k) => k.includes('env.auth'));
  const prismaContent = prismaKey ? fileMap[prismaKey] : null;
  const envContent = envKey ? fileMap[envKey] : null;
  if (prismaKey) delete fileMap[prismaKey];
  if (envKey) delete fileMap[envKey];

  writeFiles(fileMap, { force: !!options.force });

  // Append Prisma models to schema
  if (prismaContent) {
    const schemaPath = path.join(outputDir, 'prisma/schema.prisma');
    appendToFile(schemaPath, '\n// --- Auth Models (NextAuth.js) ---\n' + prismaContent);
  }

  // Append env vars
  if (envContent) {
    const envPath = path.join(outputDir, '.env.example');
    appendEnvVars(envPath, envContent);
  }
}

module.exports = { run };
