/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * Command/Event author integrity verification.
 */

const fs = require("fs");
const path = require("path");
const logger = require("../logger");

function getSourceDirectories(config) {
  const root = path.resolve(__dirname, "../../");

  return [
    path.resolve(root, config.commands?.directory || "./src/commands"),
    path.resolve(root, config.events?.directory || "./src/events")
  ];
}

function getJavaScriptFiles(directory) {
  if (!fs.existsSync(directory)) return [];

  const result = [];

  for (const entry of fs.readdirSync(directory, {
    withFileTypes: true
  })) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      result.push(...getJavaScriptFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      result.push(fullPath);
    }
  }

  return result;
}

function verifySingleFile(filePath, config) {
  try {
    if (!fs.existsSync(filePath)) return false;

    const marker = config.security?.authorMarker;
    if (!marker) return false;

    const content = fs.readFileSync(filePath, "utf8");

    return content.includes(marker);
  } catch (error) {
    logger.error(`Integrity read error: ${error.message}`);
    return false;
  }
}

async function verifyProject(config) {
  const directories = getSourceDirectories(config);
  const invalidFiles = [];
  let checkedFiles = 0;

  for (const directory of directories) {
    const files = getJavaScriptFiles(directory);

    for (const filePath of files) {
      checkedFiles++;

      if (!verifySingleFile(filePath, config)) {
        const relativePath = path.relative(
          path.resolve(__dirname, "../../"),
          filePath
        );

        invalidFiles.push(relativePath);

        logger.error(
          `AUTHOR WARNING: ${relativePath} failed integrity verification.`
        );
      }
    }
  }

  if (invalidFiles.length === 0) {
    logger.success(
      `Integrity check passed. Checked ${checkedFiles} file(s).`
    );
  }

  return {
    valid: invalidFiles.length === 0,
    checkedFiles,
    invalidFiles,
    author: config.security?.authorMarker || ""
  };
}

module.exports = {
  verifyProject,
  verifySingleFile
};
