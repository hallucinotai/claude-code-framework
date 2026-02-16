const path = require('path');
const { renderDir } = require('../lib/renderer');
const { writeFiles } = require('../lib/writer');
const { kebabCase } = require('../lib/helpers');

async function run(options, config) {
  const route = options.route || '/new-page';
  const type = options.type || 'page'; // page, layout, loading, error
  const layout = options.layout || 'dashboard';

  const routePath = route.startsWith('/') ? route.slice(1) : route;
  const segments = routePath.split('/');
  const pageName = segments[segments.length - 1] || 'page';

  const data = {
    route,
    routePath,
    type,
    layout,
    pageName,
    pageNameKebab: kebabCase(pageName),
    pageNamePascal: pageName.charAt(0).toUpperCase() + pageName.slice(1),
    isDashboard: layout === 'dashboard',
    isMarketing: layout === 'marketing',
    isAuth: layout === 'auth',
  };

  const templateDir = path.resolve(__dirname, '../../templates/nextjs/page');
  const outputDir = path.join(process.cwd(), 'app', `(${layout})`, routePath);

  const fileMap = renderDir(templateDir, data, outputDir);
  writeFiles(fileMap, { force: !!options.force });
}

module.exports = { run };
