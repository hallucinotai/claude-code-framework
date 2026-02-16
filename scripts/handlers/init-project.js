const path = require('path');
const { render, renderDir } = require('../lib/renderer');
const { writeFiles } = require('../lib/writer');
const { kebabCase, pascalCase } = require('../lib/helpers');

/**
 * Scaffold the initial Next.js project skeleton.
 * @param {object} options
 * @param {string} options.name - Project name
 * @param {string} options.description - Project description
 * @param {boolean} options.docker - Whether to include Docker files
 */
async function run(options, config) {
  const name = options.name || 'my-saas-app';
  const description = options.description || 'A SaaS application built with Next.js';
  const isDocker = options.docker === true || options.docker === 'true';

  const data = {
    projectName: name,
    projectNameKebab: kebabCase(name),
    projectNamePascal: pascalCase(name),
    description,
    isDocker,
  };

  const templateDir = path.resolve(__dirname, '../../templates/nextjs/init');
  const outputDir = process.cwd();

  const fileMap = renderDir(templateDir, data, outputDir);

  if (isDocker) {
    const deployDir = path.resolve(__dirname, '../../templates/nextjs/deploy');
    fileMap[path.join(outputDir, 'Dockerfile')] = render(path.join(deployDir, 'Dockerfile.hbs'), data);
    fileMap[path.join(outputDir, 'docker-compose.yml')] = render(path.join(deployDir, 'docker-compose.yml.hbs'), data);
    fileMap[path.join(outputDir, '.dockerignore')] = render(path.join(deployDir, '.dockerignore.hbs'), data);
  }

  writeFiles(fileMap, { force: !!options.force });
}

module.exports = { run };
