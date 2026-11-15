/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */
const logger = require("../logger");

module.exports = {
  config: { name: "connection.update" },
  run: async ({ args }) => {
    const update = args[0] || {};

    if (update.connection === "open") {
      logger.success("WhatsApp connection is online.");
    }

    if (update.connection === "close") {
      logger.warn("WhatsApp connection was closed.");
    }
  }
};
