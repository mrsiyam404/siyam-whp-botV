
/**
 * 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * WhatsApp message and command handler.
 */

const { normalizeMessage } = require("../whatsapp/normalize");

const {
  isOwner,
  isAdmin,
  isWhitelisted
} = require("../permissions/access");

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

        const sender = data.senderUID;
        const alternateIDs = data.senderAltUID
          ? [data.senderAltUID]
          : [];

        const owner = isOwner(sender, config, alternateIDs);
        const admin = isAdmin(sender, config, alternateIDs);
        const whitelisted = isWhitelisted(
          sender,
          config,
          alternateIDs
        );

        data.isOwner = owner;
        data.isAdmin = admin;
        data.isWhitelisted = whitelisted;

        const body = String(data.body || "").trim();
        if (!body) continue;

        const prefix = String(config.bot?.prefix || ",");
        const hasPrefix = body.startsWith(prefix);

        if (!hasPrefix && !config.bot?.noPrefix?.enabled) {
          continue;
        }

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

        const parts =
          input.match(/"[^"]+"|'[^']+'|\S+/g) || [];

        const commandName = (parts.shift() || "")
          .replace(/^["']|["']$/g, "");

        const commandKey = config.commands?.caseSensitive
          ? commandName
          : commandName.toLowerCase();

        if (!commandKey) continue;

        const command = commands.get(commandKey);
        if (!command) continue;

        const role = Number(command.config.role || 0);

        if (role === 2 && !owner) {
          await socket.sendMessage(data.threadID, {
            text: "⛔ শুধুমাত্র Bot Owner এই কমান্ড ব্যবহার করতে পারবেন।"
          });
          continue;
        }

        if (role === 1 && !admin) {
          await socket.sendMessage(data.threadID, {
            text: "⚠️ এই কমান্ড ব্যবহার করতে Admin permission প্রয়োজন।"
          });
          continue;
        }

        if (role === 3 && !whitelisted && !owner) {
          await socket.sendMessage(data.threadID, {
            text: "⚠️ এই কমান্ড ব্যবহারের জন্য Whitelist permission প্রয়োজন।"
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
          isWhitelisted: whitelisted,
          message: data
        });

      } catch (error) {
        logger.error("❌ Message Handler Error / মেসেজ প্রসেস করতে সমস্যা:");
        logger.error(error.stack || error.message);
      }
    }
  };
}

module.exports = { createMessageHandler };
