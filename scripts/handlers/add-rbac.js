const path = require('path');
const { renderDir } = require('../lib/renderer');
const { writeFiles, appendToFile } = require('../lib/writer');

async function run(options, config) {
  const model = options.model || 'role-based';
  const roles = Array.isArray(options.roles)
    ? options.roles
    : (options.roles || 'admin,editor,viewer').split(',').map((r) => r.trim());
  const resources = Array.isArray(options.resources)
    ? options.resources
    : (options.resources || '').split(',').map((r) => r.trim()).filter(Boolean);

  const data = { model, roles, resources, isRoleBased: model === 'role-based', isPermissionBased: model === 'permission-based' };

  const templateDir = path.resolve(__dirname, '../../templates/nextjs/rbac');
  const outputDir = process.cwd();
  const fileMap = renderDir(templateDir, data, outputDir);

  const prismaKey = Object.keys(fileMap).find((k) => k.includes('rbac-models.prisma'));
  if (prismaKey) { appendToFile(path.join(outputDir, 'prisma/schema.prisma'), '\n// --- RBAC Models ---\n' + fileMap[prismaKey]); delete fileMap[prismaKey]; }

  writeFiles(fileMap, { force: !!options.force });
}

module.exports = { run };
