/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * Command loader.
 */

const fs = require("fs");
const path = require("path");
const logger = require("../logger");
const { verifySingleFile } = require("../security/integrity");

function loadCommands(config) {
  const directory = path.resolve(__dirname);

  const commands = new Map();

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  const files = fs.readdirSync(directory);

  for (const filename of files) {
    if (!filename.endsWith(".js")) continue;

    const filePath = path.join(directory, filename);

    if (
      config.security.integrityCheck &&
      config.security.blockModifiedFiles &&
      !verifySingleFile(filePath, config)
    ) {
      logger.error(
        `${filename} blocked: Siam Hasan author marker changed.`
      );
      continue;
    }

    try {
      delete require.cache[require.resolve(filePath)];

      const command = require(filePath);

      if (!command.config || typeof command.run !== "function") {
        logger.warn(`Invalid command format: ${filename}`);
        continue;
      }

      const name = command.config.name;

      if (!name) {
        logger.warn(`Command name missing: ${filename}`);
        continue;
      }

      commands.set(name.toLowerCase(), command);

      for (const alias of command.config.aliases || []) {
        commands.set(alias.toLowerCase(), command);
      }

      logger.success(`Loaded command: ${name}`);
    } catch (error) {
      logger.error(`${filename}: ${error.message}`);
    }
  }

  return commands;
}

module.exports = { loadCommands };
