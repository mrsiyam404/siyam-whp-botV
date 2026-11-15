/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * WhatsApp incoming message event.
 */

const { createMessageHandler } = require("../handlers/message");

module.exports = {
  config: {
    name: "messages.upsert"
  },

  run: async ({ socket, config, commands, args }) => {
    const update = args[0];

    if (!update || !Array.isArray(update.messages)) return;

    const handler = createMessageHandler(
      socket,
      config,
      commands
    );

    await handler(update);
  }
};
