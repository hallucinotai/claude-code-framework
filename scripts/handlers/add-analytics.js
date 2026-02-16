const path = require('path');
const { renderDir } = require('../lib/renderer');
const { writeFiles, appendEnvVars } = require('../lib/writer');

async function run(options, config) {
  const provider = options.provider || 'posthog';
  const serverSide = options.serverSide === true || options.serverSide === 'true';
  const gdpr = options.gdpr !== false;

  const data = {
    provider,
    serverSide,
    gdpr,
    isPostHog: provider === 'posthog',
    isMixpanel: provider === 'mixpanel',
    isPlausible: provider === 'plausible',
    isCustom: provider === 'custom',
  };

  const templateDir = path.resolve(__dirname, '../../templates/nextjs/analytics');
  const outputDir = process.cwd();
  const fileMap = renderDir(templateDir, data, outputDir);

  const envKey = Object.keys(fileMap).find((k) => k.includes('env.analytics'));
  if (envKey) { appendEnvVars(path.join(outputDir, '.env.example'), fileMap[envKey]); delete fileMap[envKey]; }

  writeFiles(fileMap, { force: !!options.force });
}

module.exports = { run };
