/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */
const fs = require("fs");
const path = require("path");
const logger = require("../logger");
const { verifySingleFile } = require("../security/integrity");

function loadEvents(socket, config) {
  const directory = path.resolve(__dirname);
  if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });

  for (const filename of fs.readdirSync(directory)) {
    if (!filename.endsWith(".js") || filename === "loader.js") continue;

    const file = path.join(directory, filename);

    if (config.security.integrityCheck &&
        config.security.blockModifiedFiles &&
        !verifySingleFile(file, config)) {
      logger.error(`${filename}: author marker changed; event blocked.`);
      continue;
    }

    try {
      const event = require(file);
      if (typeof event.run !== "function" || !event.config?.name) continue;

      socket.ev.on(event.config.name, (...args) => {
        Promise.resolve(event.run({ socket, config, args }))
          .catch(error => logger.error(`${filename}: ${error.message}`));
      });

      logger.success(`Loaded event: ${event.config.name}`);
    } catch (error) {
      logger.error(`Event load error ${filename}: ${error.message}`);
    }
  }
}

module.exports = { loadEvents };
