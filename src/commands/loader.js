
/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * WhatsApp Command Loader
 */

const fs = require("fs");
const path = require("path");
const logger = require("../logger");
const { verifySingleFile } = require("../security/integrity");

function loadCommands(config) {
  const root = path.resolve(__dirname, "../../");

  const directories = [
    path.resolve(root, config.commands?.directory || "./src/commands"),
    path.resolve(root, "scripts/cmds")
  ];

  const commands = new Map();

  for (const directory of [...new Set(directories)]) {
    if (!fs.existsSync(directory)) continue;

    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".js")) continue;

      // Never load this loader file as a command.
      if (path.resolve(directory, entry.name) === __filename) continue;

      const filePath = path.join(directory, entry.name);

      if (
        config.security?.integrityCheck &&
        config.security?.blockModifiedFiles &&
        !verifySingleFile(filePath, config)
      ) {
        logger.error(`${entry.name}: author verification failed.`);
        continue;
      }

      try {
        delete require.cache[require.resolve(filePath)];
        const command = require(filePath);

        if (!command?.config || typeof command.run !== "function") {
          logger.warn(`Invalid command format: ${filePath}`);
          continue;
        }

        const name = String(command.config.name || "").trim();
        if (!name) continue;

        const names = [
          name,
          ...(Array.isArray(command.config.aliases) ? command.config.aliases : [])
        ];

        for (const item of names) {
          const key = config.commands?.caseSensitive
            ? String(item)
            : String(item).toLowerCase();

          if (key) commands.set(key, command);
        }

        logger.success(`Loaded command: ${name} [${path.relative(root, filePath)}]`);
      } catch (error) {
        logger.error(`Command load error: ${error.stack || error.message}`);
      }
    }
  }

  return commands;
}

module.exports = { loadCommands };
