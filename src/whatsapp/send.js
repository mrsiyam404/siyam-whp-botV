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
const { loadEvents } = require("../events/loader");

let reconnectTimer = null;
let starting = false;

async function startWhatsApp(config) {
  if (starting) {
    logger.warn("WhatsApp connection is already starting.");
    return null;
  }

  starting = true;

  try {
    const root = path.resolve(__dirname, "../../");
    const sessionPath = path.resolve(
      root,
      config.session?.directory || "./session"
    );

    fs.mkdirSync(sessionPath, { recursive: true });

    const { state, saveCreds } =
      await useMultiFileAuthState(sessionPath);

    const socket = makeWASocket({
      auth: state,
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      browser: ["SIYAM HASAN BOT", "Chrome", "1.0.0"],
      markOnlineOnConnect: false,
      syncFullHistory: false
    });

    socket.ev.on("creds.update", saveCreds);

    const commands = loadCommands(config);

    loadEvents(socket, config, commands);

    socket.ev.on("connection.update", update => {
      const { connection, lastDisconnect } = update;

      if (connection === "connecting") {
        logger.info("Connecting to WhatsApp...");
      }

      if (connection === "open") {
        logger.success("WhatsApp connected successfully.");

        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
      }

      if (connection === "close") {
        const statusCode =
          lastDisconnect?.error?.output?.statusCode;

        if (statusCode === DisconnectReason.loggedOut) {
          logger.error(
            "WhatsApp session logged out. Please pair the device again."
          );
          return;
        }

        if (reconnectTimer) return;

        logger.warn("Connection closed. Reconnecting in 3 seconds...");

        reconnectTimer = setTimeout(() => {
          reconnectTimer = null;
          startWhatsApp(config).catch(error => {
            logger.error(`Reconnect error: ${error.message}`);
          });
        }, 3000);
      }
    });

    if (!state.creds.registered && config.bot?.pairingCode) {
      const phoneNumber = String(
        config.bot.phoneNumber || ""
      ).replace(/\D/g, "");

      if (!phoneNumber) {
        logger.warn(
          "Set bot.phoneNumber in config.json to receive a pairing code."
        );
      } else {
        setTimeout(async () => {
          try {
            if (state.creds.registered) return;

            const code = await socket.requestPairingCode(phoneNumber);

            logger.info(`WhatsApp Pairing Code: ${code}`);
          } catch (error) {
            logger.error(`Pairing error: ${error.message}`);
          }
        }, 3000);
      }
    }

    return socket;
  } catch (error) {
    logger.error(`WhatsApp startup error: ${error.stack || error.message}`);
    throw error;
  } finally {
    starting = false;
  }
}

module.exports = { startWhatsApp };
