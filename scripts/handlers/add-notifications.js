const path = require('path');
const { renderDir } = require('../lib/renderer');
const { writeFiles, appendToFile, appendEnvVars } = require('../lib/writer');

async function run(options, config) {
  const channels = Array.isArray(options.channels)
    ? options.channels
    : (options.channels || 'email,in-app').split(',').map((c) => c.trim());
  const emailProvider = options.emailProvider || 'resend';
  const realtime = options.realtime === true || options.realtime === 'true';

  const data = {
    channels,
    emailProvider,
    realtime,
    hasEmail: channels.includes('email'),
    hasInApp: channels.includes('in-app'),
    hasPush: channels.includes('push'),
    hasWebhook: channels.includes('webhook'),
  };

  const templateDir = path.resolve(__dirname, '../../templates/nextjs/notifications');
  const outputDir = process.cwd();
  const fileMap = renderDir(templateDir, data, outputDir);

  const prismaKey = Object.keys(fileMap).find((k) => k.includes('notification-models.prisma'));
  const envKey = Object.keys(fileMap).find((k) => k.includes('env.notifications'));
  if (prismaKey) { appendToFile(path.join(outputDir, 'prisma/schema.prisma'), '\n// --- Notification Models ---\n' + fileMap[prismaKey]); delete fileMap[prismaKey]; }
  if (envKey) { appendEnvVars(path.join(outputDir, '.env.example'), fileMap[envKey]); delete fileMap[envKey]; }

  writeFiles(fileMap, { force: !!options.force });
}

module.exports = { run };
