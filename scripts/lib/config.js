/**
 * Reads and writes .saas-playbook.yml configuration.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const CONFIG_FILENAME = '.saas-playbook.yml';

function getConfigPath(projectRoot) {
  return path.join(projectRoot || process.cwd(), CONFIG_FILENAME);
}

/**
 * Read and parse .saas-playbook.yml from the project root.
 * @param {string} [projectRoot] - Project root directory (defaults to cwd)
 * @returns {object} Parsed config object
 */
function readConfig(projectRoot) {
  const configPath = getConfigPath(projectRoot);
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config not found: ${configPath}\nRun /init first to create the project config.`);
  }
  const raw = fs.readFileSync(configPath, 'utf8');
  return yaml.load(raw) || {};
}

/**
 * Write config object back to .saas-playbook.yml.
 * @param {object} data - Config object to serialize
 * @param {string} [projectRoot] - Project root directory (defaults to cwd)
 */
function writeConfig(data, projectRoot) {
  const configPath = getConfigPath(projectRoot);
  const raw = yaml.dump(data, { lineWidth: 120, noRefs: true, quotingType: '"' });
  fs.writeFileSync(configPath, raw, 'utf8');
}

/**
 * Get the stack section from config.
 */
function getStack(config) {
  return config.stack || {};
}

/**
 * Get the features section from config.
 */
function getFeatures(config) {
  return config.features || {};
}

/**
 * Check if a specific feature is enabled.
 * @param {object} config - Parsed config
 * @param {string} name - Feature name (e.g., 'auth', 'billing')
 * @returns {boolean}
 */
function isFeatureEnabled(config, name) {
  const features = getFeatures(config);
  return !!(features[name] && features[name].enabled);
}

module.exports = {
  readConfig,
  writeConfig,
  getStack,
  getFeatures,
  isFeatureEnabled,
  getConfigPath,
  CONFIG_FILENAME,
};
