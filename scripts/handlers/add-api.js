const path = require('path');
const { renderDir } = require('../lib/renderer');
const { writeFiles } = require('../lib/writer');
const { kebabCase, camelCase, pascalCase } = require('../lib/helpers');

async function run(options, config) {
  const apiPath = options.path || 'resource';
  const methods = Array.isArray(options.methods)
    ? options.methods
    : (options.methods || 'GET,POST').split(',').map((m) => m.trim().toUpperCase());
  const crud = options.crud === true || options.crud === 'true';

  const resourceName = apiPath.split('/').pop() || 'resource';

  const data = {
    path: apiPath,
    methods,
    crud,
    resourceName,
    resourceNameKebab: kebabCase(resourceName),
    resourceNameCamel: camelCase(resourceName),
    resourceNamePascal: pascalCase(resourceName),
    hasGet: methods.includes('GET'),
    hasPost: methods.includes('POST'),
    hasPatch: methods.includes('PATCH'),
    hasPut: methods.includes('PUT'),
    hasDelete: methods.includes('DELETE'),
  };

  const templateDir = path.resolve(__dirname, '../../templates/nextjs/api');
  const outputDir = path.join(process.cwd(), 'app/api', apiPath);

  const fileMap = renderDir(templateDir, data, outputDir);
  writeFiles(fileMap, { force: !!options.force });
}

module.exports = { run };
