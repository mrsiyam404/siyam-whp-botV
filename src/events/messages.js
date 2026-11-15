/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */
const { createMessageHandler } = require("../handlers/message");
const { loadCommands } = require("../commands/loader");

module.exports = {
  config: { name: "messages.upsert" },
  run: async ({ socket, config, args }) => {
    const commands = loadCommands(config);
    await createMessageHandler(socket, config, commands)(args[0]);
  }
};
