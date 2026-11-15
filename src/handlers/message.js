/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * Message and command handler.
 */

const { normalizeMessage } = require("../whatsapp/normalize");
const { isOwner, isAdmin } = require("../permissions/access");
const logger = require("../logger");

function createMessageHandler(socket, config, commands) {
  return async function handleMessage(update) {
    if (!update || !Array.isArray(update.messages)) return;

    for (const message of update.messages) {
      if (!message?.message || message.key?.fromMe) continue;

      try {
        const data = normalizeMessage(message, socket);

        if (data.isGroup && !config.groups?.enabled) continue;
        if (data.isInbox && !config.inbox?.enabled) continue;

        const sender = String(data.sender || "");

        const owner = isOwner(sender, config);
        const admin = isAdmin(sender, config);

        data.isOwner = owner;
        data.isAdmin = admin;

        const body = String(data.body || "").trim();
        if (!body) continue;

        const prefix = String(config.bot?.prefix || ",");
        const hasPrefix = body.startsWith(prefix);

        if (!hasPrefix && !config.bot?.noPrefix?.enabled) continue;

        if (
          !hasPrefix &&
          config.bot?.noPrefix?.adminOnly &&
          !admin
        ) {
          continue;
        }

        const input = hasPrefix
          ? body.slice(prefix.length).trim()
          : body;

        if (!input) continue;

        const parts = input.match(/"[^"]+"|'[^']+'|\S+/g) || [];
        const commandName = (parts.shift() || "").replace(/^["']|["']$/g, "");

        const commandKey = config.commands?.caseSensitive
          ? commandName
          : commandName.toLowerCase();

        if (!commandKey) continue;

        const command = commands.get(commandKey);
        if (!command) continue;

        const role = Number(command.config.role || 0);

        if (role === 2 && !owner) {
          await socket.sendMessage(data.threadID, {
            text: "Only the bot owner can use this command."
          });
          continue;
        }

        if (role === 1 && !admin) {
          await socket.sendMessage(data.threadID, {
            text: "Admin permission required."
          });
          continue;
        }

        const args = parts.map(value =>
          value.replace(/^["']|["']$/g, "")
        );

        await command.run({
          api: socket,
          event: data,
          args,
          config,
          isAdmin: admin,
          isOwner: owner,
          message: data
        });
      } catch (error) {
        logger.error(
          `Message handler error: ${error.stack || error.message}`
        );
      }
    }
  };
}

module.exports = { createMessageHandler };
