const path = require('path');
const { renderDir } = require('../lib/renderer');
const { writeFiles, appendToFile, appendEnvVars } = require('../lib/writer');

/**
 * Scaffold multi-tenancy files for Next.js + Prisma.
 * @param {object} options
 * @param {string} options.strategy - row-level, schema-per-tenant, database-per-tenant
 * @param {string} options.identification - subdomain, path, header
 * @param {string} options.terminology - organization, workspace, team, company
 */
async function run(options, config) {
  const strategy = options.strategy || 'row-level';
  const identification = options.identification || 'path';
  const terminology = options.terminology || 'organization';

  const data = {
    strategy,
    identification,
    terminology,
    terminologyPlural: terminology + 's',
    terminologyPascal: terminology.charAt(0).toUpperCase() + terminology.slice(1),
    isRowLevel: strategy === 'row-level',
    isSubdomain: identification === 'subdomain',
    isPathBased: identification === 'path',
  };

  const templateDir = path.resolve(__dirname, '../../templates/nextjs/multi-tenancy');
  const outputDir = process.cwd();

  const fileMap = renderDir(templateDir, data, outputDir);

  const prismaKey = Object.keys(fileMap).find((k) => k.includes('tenant-models.prisma'));
  const envKey = Object.keys(fileMap).find((k) => k.includes('env.tenant'));
  const prismaContent = prismaKey ? fileMap[prismaKey] : null;
  const envContent = envKey ? fileMap[envKey] : null;
  if (prismaKey) delete fileMap[prismaKey];
  if (envKey) delete fileMap[envKey];

  writeFiles(fileMap, { force: !!options.force });

  if (prismaContent) {
    appendToFile(path.join(outputDir, 'prisma/schema.prisma'), '\n// --- Multi-Tenancy Models ---\n' + prismaContent);
  }
  if (envContent) {
    appendEnvVars(path.join(outputDir, '.env.example'), envContent);
  }
}

module.exports = { run };
