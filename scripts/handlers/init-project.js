const path = require('path');
const { renderDir } = require('../lib/renderer');
const { writeFiles } = require('../lib/writer');
const { kebabCase, pascalCase } = require('../lib/helpers');

/**
 * Scaffold the initial Next.js project skeleton.
 * @param {object} options
 * @param {string} options.name - Project name
 * @param {string} options.description - Project description
 */
async function run(options, config) {
  const name = options.name || 'my-saas-app';
  const description = options.description || 'A SaaS application built with Next.js';

  const data = {
    projectName: name,
    projectNameKebab: kebabCase(name),
    projectNamePascal: pascalCase(name),
    description,
  };

  const templateDir = path.resolve(__dirname, '../../templates/nextjs/init');
  const outputDir = process.cwd();

  const fileMap = renderDir(templateDir, data, outputDir);
  writeFiles(fileMap, { force: !!options.force });
}

module.exports = { run };
