const path = require('path');
const { renderDir } = require('../lib/renderer');
const { writeFiles, appendToFile, appendEnvVars } = require('../lib/writer');

async function run(options, config) {
  const model = options.model || 'team';
  const roles = Array.isArray(options.roles)
    ? options.roles
    : (options.roles || 'owner,admin,member').split(',').map((r) => r.trim());
  const invitationFlow = options.invitationFlow || 'email';

  const data = {
    model,
    modelPascal: model.charAt(0).toUpperCase() + model.slice(1),
    roles,
    invitationFlow,
    hasEmailInvite: invitationFlow === 'email' || invitationFlow === 'both',
    hasLinkInvite: invitationFlow === 'link' || invitationFlow === 'both',
  };

  const templateDir = path.resolve(__dirname, '../../templates/nextjs/teams');
  const outputDir = process.cwd();
  const fileMap = renderDir(templateDir, data, outputDir);

  const prismaKey = Object.keys(fileMap).find((k) => k.includes('team-models.prisma'));
  const envKey = Object.keys(fileMap).find((k) => k.includes('env.teams'));
  if (prismaKey) { appendToFile(path.join(outputDir, 'prisma/schema.prisma'), '\n// --- Team Models ---\n' + fileMap[prismaKey]); delete fileMap[prismaKey]; }
  if (envKey) { appendEnvVars(path.join(outputDir, '.env.example'), fileMap[envKey]); delete fileMap[envKey]; }

  writeFiles(fileMap, { force: !!options.force });
}

module.exports = { run };
