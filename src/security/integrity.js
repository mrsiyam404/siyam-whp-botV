/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * Command/Event author integrity verification.
 */

const fs = require("fs");
const path = require("path");
const logger = require("../logger");

async function verifyProject(config) {
  const marker = config.security.authorMarker;
  const directories = [
    path.resolve(__dirname, "../commands"),
    path.resolve(__dirname, "../events")
  ];

  let valid = true;

  for (const directory of directories) {
    if (!fs.existsSync(directory)) continue;

    const files = fs.readdirSync(directory, {
      withFileTypes: true
    });

    for (const entry of files) {
      if (!entry.isFile() || !entry.name.endsWith(".js")) continue;

      const filePath = path.join(directory, entry.name);
      const content = fs.readFileSync(filePath, "utf8");

      if (!content.includes(marker)) {
        valid = false;

        logger.error(
          `AUTHOR WARNING: ${entry.name} - Siam Hasan author marker changed.`
        );
      }
    }
  }

  if (valid) {
    logger.success("Command/Event author integrity verified.");
  }

  return {
    valid,
    author: marker
  };
}

function verifySingleFile(filePath, config) {
  if (!fs.existsSync(filePath)) return false;

  const content = fs.readFileSync(filePath, "utf8");
  return content.includes(config.security.authorMarker);
}

module.exports = {
  verifyProject,
  verifySingleFile
};
