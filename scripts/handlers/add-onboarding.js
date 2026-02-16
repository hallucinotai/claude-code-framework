const path = require('path');
const { renderDir } = require('../lib/renderer');
const { writeFiles, appendToFile } = require('../lib/writer');

async function run(options, config) {
  const steps = Array.isArray(options.steps)
    ? options.steps
    : (options.steps || 'profile,workspace,invite').split(',').map((s) => s.trim());
  const checklist = options.checklist !== false;
  const guidedTour = options.guidedTour === true || options.guidedTour === 'true';

  const data = { steps, checklist, guidedTour, stepCount: steps.length };

  const templateDir = path.resolve(__dirname, '../../templates/nextjs/onboarding');
  const outputDir = process.cwd();
  const fileMap = renderDir(templateDir, data, outputDir);

  const prismaKey = Object.keys(fileMap).find((k) => k.includes('onboarding-models.prisma'));
  if (prismaKey) { appendToFile(path.join(outputDir, 'prisma/schema.prisma'), '\n// --- Onboarding Models ---\n' + fileMap[prismaKey]); delete fileMap[prismaKey]; }

  writeFiles(fileMap, { force: !!options.force });
}

module.exports = { run };
