const path = require('path');
const { renderDir } = require('../lib/renderer');
const { writeFiles } = require('../lib/writer');

async function run(options, config) {
  const provider = options.provider || 'github-actions';
  const stages = Array.isArray(options.stages)
    ? options.stages
    : (options.stages || 'lint,test,build').split(',').map((s) => s.trim());
  const autoDeploy = options.autoDeploy === true || options.autoDeploy === 'true';

  const data = {
    provider,
    stages,
    autoDeploy,
    isGitHub: provider === 'github-actions',
    hasLint: stages.includes('lint'),
    hasTest: stages.includes('test'),
    hasBuild: stages.includes('build'),
    hasDeploy: stages.includes('deploy') || autoDeploy,
  };

  const templateDir = path.resolve(__dirname, '../../templates/nextjs/ci');
  const outputDir = process.cwd();

  const fileMap = renderDir(templateDir, data, outputDir);
  writeFiles(fileMap, { force: !!options.force });
}

module.exports = { run };
