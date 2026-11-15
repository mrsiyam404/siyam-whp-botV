/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * Event loader.
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
  const directory = path.resolve(
    root,
    config.events?.directory || "./src/events"
  );

  if (!fs.existsSync(directory)) {
    logger.warn(`Event directory not found: ${directory}`);
    return;
  }

  const files = fs.readdirSync(directory, {
    withFileTypes: true
  });

  for (const entry of files) {
    if (
      !entry.isFile() ||
      !entry.name.endsWith(".js") ||
      entry.name === "loader.js"
    ) {
      continue;
    }

    const filePath = path.join(directory, entry.name);

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
        logger.warn(`Invalid event format: ${entry.name}`);
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
            `Event error (${entry.name}): ${error.stack || error.message}`
          );
        });
      });

      logger.success(`Loaded event: ${event.config.name}`);
    } catch (error) {
      logger.error(
        `Event load error (${entry.name}): ${error.message}`
      );
    }
  }
}

module.exports = { loadEvents };
