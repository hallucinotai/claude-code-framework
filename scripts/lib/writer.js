/**
 * File writer with conflict detection and batch operations.
 */

const fs = require('fs');
const path = require('path');

/** Track created files for summary output */
const createdFiles = [];

/**
 * Check if a file exists.
 */
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Write a single file, creating parent directories as needed.
 * @param {string} filePath - Absolute path to write
 * @param {string} content - File content
 * @param {object} [opts] - Options
 * @param {boolean} [opts.force] - Overwrite existing files
 * @returns {boolean} Whether the file was written
 */
function writeFile(filePath, content, opts = {}) {
  if (fileExists(filePath) && !opts.force) {
    console.log(`  [~] Skipped ${path.relative(process.cwd(), filePath)} (already exists)`);
    return false;
  }
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf8');
  const relPath = path.relative(process.cwd(), filePath);
  console.log(`  [+] Created ${relPath}`);
  createdFiles.push(relPath);
  return true;
}

/**
 * Append content to a file. Creates it if it doesn't exist.
 * If marker is provided, inserts before the marker line.
 * @param {string} filePath - Absolute path
 * @param {string} content - Content to append
 * @param {string} [marker] - Optional marker comment to insert before
 */
function appendToFile(filePath, content, marker) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fileExists(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
    const relPath = path.relative(process.cwd(), filePath);
    console.log(`  [+] Created ${relPath}`);
    createdFiles.push(relPath);
    return;
  }

  let existing = fs.readFileSync(filePath, 'utf8');

  // Check for duplicate content (skip if already appended)
  if (existing.includes(content.trim())) {
    console.log(`  [~] Skipped append to ${path.relative(process.cwd(), filePath)} (content already present)`);
    return;
  }

  if (marker && existing.includes(marker)) {
    existing = existing.replace(marker, content + '\n' + marker);
  } else {
    existing = existing.trimEnd() + '\n\n' + content + '\n';
  }

  fs.writeFileSync(filePath, existing, 'utf8');
  const relPath = path.relative(process.cwd(), filePath);
  console.log(`  [+] Updated ${relPath}`);
  createdFiles.push(relPath);
}

/**
 * Append environment variables to .env.example, skipping duplicates.
 * @param {string} filePath - Path to .env.example
 * @param {string} envContent - Env vars block to append
 */
function appendEnvVars(filePath, envContent) {
  if (!fileExists(filePath)) {
    writeFile(filePath, envContent);
    return;
  }
  const existing = fs.readFileSync(filePath, 'utf8');
  const lines = envContent.split('\n').filter((l) => l.trim());
  const newLines = [];
  for (const line of lines) {
    if (line.startsWith('#')) {
      newLines.push(line);
      continue;
    }
    const key = line.split('=')[0];
    if (key && !existing.includes(key + '=')) {
      newLines.push(line);
    }
  }
  if (newLines.length > 0) {
    appendToFile(filePath, newLines.join('\n'));
  }
}

/**
 * Batch write multiple files from a { path: content } map.
 * @param {Object<string, string>} fileMap - Map of filePath -> content
 * @param {object} [opts] - Options passed to writeFile
 */
function writeFiles(fileMap, opts = {}) {
  for (const [filePath, content] of Object.entries(fileMap)) {
    writeFile(filePath, content, opts);
  }
}

/**
 * Get list of all files created/updated in this run.
 */
function getCreatedFiles() {
  return [...createdFiles];
}

/**
 * Reset the created files tracker.
 */
function resetCreatedFiles() {
  createdFiles.length = 0;
}

module.exports = {
  writeFile,
  appendToFile,
  appendEnvVars,
  fileExists,
  writeFiles,
  getCreatedFiles,
  resetCreatedFiles,
};
