/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * Command loader.
 */

const fs = require("fs");
const path = require("path");
const logger = require("../logger");
const { verifySingleFile } = require("../security/integrity");

function loadCommands(config) {
  const root = path.resolve(__dirname, "../../");
  const directory = path.resolve(
    root,
    config.commands?.directory || "./src/commands"
  );

  const commands = new Map();

  if (!fs.existsSync(directory)) {
    logger.warn(`Command directory not found: ${directory}`);
    return commands;
  }

  const files = fs.readdirSync(directory, {
    withFileTypes: true
  });

  for (const entry of files) {
    if (!entry.isFile() || !entry.name.endsWith(".js")) continue;

    const filePath = path.join(directory, entry.name);

    if (
      config.security?.integrityCheck &&
      config.security?.blockModifiedFiles &&
      !verifySingleFile(filePath, config)
    ) {
      logger.error(
        `${entry.name} blocked: author marker verification failed.`
      );
      continue;
    }

    try {
      delete require.cache[require.resolve(filePath)];

      const command = require(filePath);

      if (
        !command ||
        !command.config ||
        typeof command.run !== "function"
      ) {
        logger.warn(`Invalid command format: ${entry.name}`);
        continue;
      }

      const name = String(command.config.name || "").trim();

      if (!name) {
        logger.warn(`Command name missing: ${entry.name}`);
        continue;
      }

      const names = [
        name,
        ...(Array.isArray(command.config.aliases)
          ? command.config.aliases
          : [])
      ];

      for (const commandName of names) {
        const key = config.commands?.caseSensitive
          ? String(commandName)
          : String(commandName).toLowerCase();

        if (key) commands.set(key, command);
      }

      logger.success(`Loaded command: ${name}`);
    } catch (error) {
      logger.error(`Command load error (${entry.name}): ${error.message}`);
    }
  }

  return commands;
}

module.exports = { loadCommands };
