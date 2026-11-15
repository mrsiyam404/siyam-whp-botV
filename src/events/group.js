/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */
const logger = require("../logger");

module.exports = {
  config: { name: "groups.update" },
  run: async ({ args }) => {
    const updates = args[0] || [];

    for (const group of updates) {
      logger.info(`Group updated: ${group.id || "unknown"}`);
    }
  }
};
