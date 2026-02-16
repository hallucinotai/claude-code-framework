const path = require('path');
const { render } = require('../lib/renderer');
const { writeFile, appendToFile } = require('../lib/writer');
const { camelCase, pascalCase, pluralize } = require('../lib/helpers');

/**
 * Parse field definitions from compact format.
 * Format: "title:string:required,status:enum(draft,published):default(draft)"
 */
function parseFields(fieldsStr) {
  if (!fieldsStr) return [];
  const fields = fieldsStr.split(',').map((f) => f.trim());
  return fields.map((field) => {
    const parts = field.split(':');
    const name = parts[0];
    const type = parts[1] || 'string';
    const modifiers = parts.slice(2);

    const isRequired = modifiers.includes('required');
    const isOptional = modifiers.includes('optional');
    const isUnique = modifiers.includes('unique');
    const defaultMatch = modifiers.find((m) => m.startsWith('default('));
    const defaultValue = defaultMatch ? defaultMatch.slice(8, -1) : null;

    // Parse enum values
    const enumMatch = type.match(/^enum\((.+)\)$/);
    const enumValues = enumMatch ? enumMatch[1].split(',').map((v) => v.trim()) : null;

    // Map to Prisma type
    let prismaType = 'String';
    if (type === 'int' || type === 'integer') prismaType = 'Int';
    else if (type === 'float' || type === 'decimal') prismaType = 'Float';
    else if (type === 'boolean' || type === 'bool') prismaType = 'Boolean';
    else if (type === 'datetime' || type === 'date') prismaType = 'DateTime';
    else if (type === 'json') prismaType = 'Json';
    else if (type === 'text') prismaType = 'String';
    else if (enumMatch) prismaType = pascalCase(name) + 'Type';

    return { name, type, prismaType, isRequired, isOptional, isUnique, defaultValue, enumValues };
  });
}

async function run(options, config) {
  const name = options.name || 'item';
  const fields = parseFields(typeof options.fields === 'string' ? options.fields : '');
  const relations = Array.isArray(options.relations)
    ? options.relations
    : (options.relations || '').split(',').map((r) => r.trim()).filter(Boolean);

  const data = {
    name,
    nameCamel: camelCase(name),
    namePascal: pascalCase(name),
    namePlural: pluralize(camelCase(name)),
    namePluralPascal: pascalCase(pluralize(name)),
    fields,
    relations,
    hasFields: fields.length > 0,
  };

  const templateDir = path.resolve(__dirname, '../../templates/nextjs/model');
  const outputDir = process.cwd();

  // Render and append prisma model
  const prismaTemplate = path.join(templateDir, 'model.prisma.hbs');
  const prismaContent = render(prismaTemplate, data);
  appendToFile(path.join(outputDir, 'prisma/schema.prisma'), '\n' + prismaContent);

  // Render service file
  const serviceTemplate = path.join(templateDir, 'service.ts.hbs');
  const serviceContent = render(serviceTemplate, data);
  writeFile(path.join(outputDir, 'lib', `${camelCase(name)}.service.ts`), serviceContent, { force: !!options.force });

  // Render types file
  const typesTemplate = path.join(templateDir, 'types.ts.hbs');
  const typesContent = render(typesTemplate, data);
  writeFile(path.join(outputDir, 'lib', `${camelCase(name)}.types.ts`), typesContent, { force: !!options.force });
}

module.exports = { run };
