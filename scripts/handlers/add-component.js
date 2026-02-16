const path = require('path');
const { renderDir } = require('../lib/renderer');
const { writeFiles } = require('../lib/writer');
const { kebabCase, pascalCase } = require('../lib/helpers');

async function run(options, config) {
  const name = options.name || 'my-component';
  const props = Array.isArray(options.props)
    ? options.props
    : (options.props || '').split(',').map((p) => p.trim()).filter(Boolean);
  const variants = Array.isArray(options.variants)
    ? options.variants
    : (options.variants || '').split(',').map((v) => v.trim()).filter(Boolean);

  const data = {
    name,
    nameKebab: kebabCase(name),
    namePascal: pascalCase(name),
    props,
    variants,
    hasProps: props.length > 0,
    hasVariants: variants.length > 0,
  };

  const templateDir = path.resolve(__dirname, '../../templates/nextjs/component');
  const outputDir = path.join(process.cwd(), 'components', kebabCase(name));

  const fileMap = renderDir(templateDir, data, outputDir);
  writeFiles(fileMap, { force: !!options.force });
}

module.exports = { run };
