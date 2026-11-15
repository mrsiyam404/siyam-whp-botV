/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * WhatsApp connection and pairing system.
 */

const fs = require("fs");
const path = require("path");
const pino = require("pino");

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const logger = require("../logger");
const { loadCommands } = require("../commands/loader");
const { createMessageHandler } = require("../handlers/message");

async function startWhatsApp(config) {
  const sessionPath = path.resolve(
    __dirname,
    "../../",
    config.session.directory
  );

  fs.mkdirSync(sessionPath, { recursive: true });

  const { state, saveCreds } =
    await useMultiFileAuthState(sessionPath);

  const commands = loadCommands(config);

  const socket = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    browser: ["SIYAM HASAN BOT", "Chrome", "1.0.0"],
    markOnlineOnConnect: false,
    syncFullHistory: false
  });

  socket.ev.on("creds.update", saveCreds);

  socket.ev.on("connection.update", async update => {
    const { connection, lastDisconnect } = update;

    if (connection === "connecting") {
      logger.info("Connecting to WhatsApp...");
    }

    if (connection === "open") {
      logger.success("WhatsApp connected successfully.");
    }

    if (connection === "close") {
      const statusCode =
        lastDisconnect?.error?.output?.statusCode;

      if (statusCode === DisconnectReason.loggedOut) {
        logger.error("WhatsApp session logged out.");
        return;
      }

      logger.warn("Connection closed. Reconnecting...");
      setTimeout(() => startWhatsApp(config), 3000);
    }
  });

  if (!socket.authState?.creds?.registered && config.bot.pairingCode) {
    const phoneNumber = String(config.bot.phoneNumber || "")
      .replace(/\D/g, "");

    if (!phoneNumber) {
      logger.warn(
        "Set bot.phoneNumber in config.json to receive a pairing code."
      );
    } else {
      setTimeout(async () => {
        try {
          const code = await socket.requestPairingCode(phoneNumber);
          logger.info(`WhatsApp Pairing Code: ${code}`);
        } catch (error) {
          logger.error(`Pairing error: ${error.message}`);
        }
      }, 2000);
    }
  }

  socket.ev.on(
    "messages.upsert",
    createMessageHandler(socket, config, commands)
  );

  return socket;
}

module.exports = { startWhatsApp };
