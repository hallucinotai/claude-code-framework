const path = require('path');
const { renderDir } = require('../lib/renderer');
const { writeFiles } = require('../lib/writer');

async function run(options, config) {
  const coverage = options.coverage !== false;
  const organization = options.organization || 'co-located';

  const data = { coverage, organization, isCoLocated: organization === 'co-located', isCentralized: organization === 'centralized' };

  const templateDir = path.resolve(__dirname, '../../templates/nextjs/test-setup');
  const outputDir = process.cwd();

  const fileMap = renderDir(templateDir, data, outputDir);
  writeFiles(fileMap, { force: !!options.force });
}

module.exports = { run };
