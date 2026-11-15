
/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * WhatsApp Event Loader
 * Supports both src/events and scripts/events.
 */

const fs = require("fs");
const path = require("path");
const logger = require("../logger");
const { verifySingleFile } = require("../security/integrity");

const loadedSockets = new WeakSet();

function loadEvents(socket, config, commands) {
  if (loadedSockets.has(socket)) {
    logger.warn("Events already loaded for this socket.");
    return;
  }

  loadedSockets.add(socket);

  const root = path.resolve(__dirname, "../../");

  // Keep the existing event directory and add root scripts/events.
  const directories = [
    path.resolve(
      root,
      config.events?.directory || "./src/events"
    ),
    path.resolve(root, "scripts/events")
  ];

  const uniqueDirectories = [...new Set(directories)];
  const loadedFiles = new Set();

  for (const directory of uniqueDirectories) {
    if (!fs.existsSync(directory)) {
      logger.warn(`Event directory not found: ${directory}`);
      continue;
    }

    let entries;

    try {
      entries = fs.readdirSync(directory, {
        withFileTypes: true
      });
    } catch (error) {
      logger.error(
        `Cannot read event directory (${directory}): ${error.message}`
      );
      continue;
    }

    for (const entry of entries) {
      if (
        !entry.isFile() ||
        !entry.name.endsWith(".js") ||
        entry.name === "loader.js"
      ) {
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
          `${entry.name}: author verification failed; event blocked.`
        );
        continue;
      }

      try {
        delete require.cache[require.resolve(filePath)];

        const event = require(filePath);

        if (
          !event ||
          !event.config?.name ||
          typeof event.run !== "function"
        ) {
          logger.warn(`Invalid event format: ${filePath}`);
          continue;
        }

        socket.ev.on(event.config.name, (...args) => {
          Promise.resolve(
            event.run({
              socket,
              config,
              commands,
              args
            })
          ).catch(error => {
            logger.error(
              `Event error (${filePath}): ${error.stack || error.message}`
            );
          });
        });

        logger.success(
          `Loaded event: ${event.config.name} [${path.relative(root, filePath)}]`
        );
      } catch (error) {
        logger.error(
          `Event load error (${filePath}): ${error.stack || error.message}`
        );
      }
    }
  }
}

module.exports = { loadEvents };
