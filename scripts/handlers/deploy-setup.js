const path = require('path');
const { renderDir } = require('../lib/renderer');
const { writeFiles } = require('../lib/writer');

async function run(options, config) {
  const provider = options.provider || 'vercel';
  const environments = Array.isArray(options.environments)
    ? options.environments
    : (options.environments || 'development,staging,production').split(',').map((e) => e.trim());

  const data = {
    provider,
    environments,
    isVercel: provider === 'vercel',
    isDocker: provider === 'docker',
    isRailway: provider === 'railway',
    isFly: provider === 'fly',
    isAWS: provider === 'aws',
  };

  const templateDir = path.resolve(__dirname, '../../templates/nextjs/deploy');
  const outputDir = process.cwd();

  const fileMap = renderDir(templateDir, data, outputDir);
  writeFiles(fileMap, { force: !!options.force });
}

module.exports = { run };
