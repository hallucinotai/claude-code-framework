/**
 * Handlebars template compilation and rendering engine.
 * Renders .hbs templates with data, preserving directory structure.
 */

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const { registerHelpers } = require('./helpers');

// Register all custom helpers
registerHelpers(Handlebars);

/**
 * Compile and render a single .hbs template file.
 * @param {string} templatePath - Absolute path to .hbs template
 * @param {object} data - Template data
 * @returns {string} Rendered content
 */
function render(templatePath, data) {
  const source = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(source, { noEscape: true });
  return template(data);
}

/**
 * Render all .hbs templates in a directory, preserving folder structure.
 * Template files named `filename.ext.hbs` render to `filename.ext`.
 *
 * @param {string} templateDir - Absolute path to template directory
 * @param {object} data - Template data
 * @param {string} outputDir - Absolute path to output directory
 * @returns {Object<string, string>} Map of outputPath -> rendered content
 */
function renderDir(templateDir, data, outputDir) {
  const fileMap = {};

  if (!fs.existsSync(templateDir)) {
    throw new Error(`Template directory not found: ${templateDir}`);
  }

  function walk(dir, relativeDir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // Resolve directory name (may contain {{handlebars}} expressions)
        const dirName = renderString(entry.name, data);
        walk(srcPath, path.join(relativeDir, dirName));
      } else if (entry.name.endsWith('.hbs')) {
        // Strip .hbs extension and resolve any handlebars in filename
        const baseName = entry.name.slice(0, -4);
        const resolvedName = renderString(baseName, data);
        const outputPath = path.join(outputDir, relativeDir, resolvedName);
        fileMap[outputPath] = render(srcPath, data);
      }
    }
  }

  walk(templateDir, '');
  return fileMap;
}

/**
 * Render a string that may contain Handlebars expressions.
 * Used for dynamic filenames and directory names.
 */
function renderString(str, data) {
  if (!str.includes('{{')) return str;
  const template = Handlebars.compile(str, { noEscape: true });
  return template(data);
}

module.exports = {
  render,
  renderDir,
  renderString,
};
