/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * Message and command handler.
 */

const { normalizeMessage } = require("../whatsapp/normalize");
const logger = require("../logger");

function createMessageHandler(socket, config, commands) {
  return async function handleMessage(update) {
    const messages = update.messages || [];

    for (const message of messages) {
      if (!message.message || message.key?.fromMe) continue;

      const data = normalizeMessage(message, socket);

      if (data.isGroup && !config.groups.enabled) continue;
      if (data.isInbox && !config.inbox.enabled) continue;

      const sender = data.sender;
      const owners = config.owner.numbers.map(String);
      const admins = config.admins.map(String);

      const isOwner = owners.includes(sender);
      const isAdmin = isOwner || admins.includes(sender);

      data.isAdmin = isAdmin;
      data.isOwner = isOwner;

      const body = data.body.trim();
      if (!body) continue;

      const prefix = config.bot.prefix;
      const hasPrefix = body.startsWith(prefix);

      if (!hasPrefix && !config.bot.noPrefix.enabled) continue;
      if (!hasPrefix && config.bot.noPrefix.adminOnly && !isAdmin) continue;

      const input = hasPrefix
        ? body.slice(prefix.length).trim()
        : body;

      const args = input.split(/\s+/);
      const commandName = (args.shift() || "").toLowerCase();

      if (!commandName) continue;

      const command = commands.get(commandName);
      if (!command) continue;

      try {
        if (
          command.config.role === 2 &&
          !isOwner
        ) {
          await socket.sendMessage(data.threadID, {
            text: "Only the bot owner can use this command."
          });
          continue;
        }

        if (
          command.config.role === 1 &&
          !isAdmin
        ) {
          await socket.sendMessage(data.threadID, {
            text: "Admin permission required."
          });
          continue;
        }

        await command.run({
          api: socket,
          event: data,
          args,
          config,
          isAdmin,
          isOwner,
          message: data
        });
      } catch (error) {
        logger.error(`Command ${commandName}: ${error.stack || error}`);

        await socket.sendMessage(data.threadID, {
          text: "Command execution failed."
        }).catch(() => {});
      }
    }
  };
}

module.exports = { createMessageHandler };
