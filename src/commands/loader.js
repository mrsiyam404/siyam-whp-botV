
/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * WhatsApp Command Loader
 * Supports both src/commands and scripts/cmds.
 */

const fs = require("fs");
const path = require("path");
const logger = require("../logger");
const { verifySingleFile } = require("../security/integrity");

function loadCommands(config) {
  const root = path.resolve(__dirname, "../../");

  // Keep the existing command directory and add the new root scripts/cmds.
  const directories = [
    path.resolve(
      root,
      config.commands?.directory || "./src/commands"
    ),
    path.resolve(root, "scripts/cmds")
  ];

  const uniqueDirectories = [...new Set(directories)];
  const commands = new Map();
  const loadedFiles = new Set();

  for (const directory of uniqueDirectories) {
    if (!fs.existsSync(directory)) {
      logger.warn(`Command directory not found: ${directory}`);
      continue;
    }

    let entries;

    try {
      entries = fs.readdirSync(directory, {
        withFileTypes: true
      });
    } catch (error) {
      logger.error(
        `Cannot read command directory (${directory}): ${error.message}`
      );
      continue;
    }

    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".js")) {
        continue;
      }

      const filePath = path.join(directory, entry.name);

      if (loadedFiles.has(filePath)) continue;
      loadedFiles.add(filePath);

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
          logger.warn(`Invalid command format: ${filePath}`);
          continue;
        }

        const name = String(command.config.name || "").trim();

        if (!name) {
          logger.warn(`Command name missing: ${filePath}`);
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

        logger.success(
          `Loaded command: ${name} [${path.relative(root, filePath)}]`
        );
      } catch (error) {
        logger.error(
          `Command load error (${filePath}): ${error.stack || error.message}`
        );
      }
    }
  }

  return commands;
}

module.exports = { loadCommands };
