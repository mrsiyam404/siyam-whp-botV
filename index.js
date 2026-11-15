/**
 * WhatsApp Bot Core
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * Messenger GoatBot compatibility project.
 */

const { loadConfig } = require("./src/config");
const logger = require("./src/logger");
const { startWhatsApp } = require("./src/whatsapp/client");
const { verifyProject } = require("./src/security/integrity");

async function main() {
  try {
    const config = loadConfig();

    logger.info("𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍 WhatsApp Bot starting...");

    if (config.security.integrityCheck) {
      const result = await verifyProject(config);

      if (!result.valid) {
        logger.error("Integrity check failed. Bot startup stopped.");
        process.exit(1);
      }
    }

    await startWhatsApp(config);
  } catch (error) {
    logger.error(`Startup error: ${error.message}`);
    process.exit(1);
  }
}

process.on("unhandledRejection", error => {
  logger.error(`Unhandled rejection: ${error.stack || error}`);
});

process.on("uncaughtException", error => {
  logger.error(`Uncaught exception: ${error.stack || error}`);
});

process.on("SIGINT", () => {
  logger.info("Bot shutting down...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("Bot shutting down...");
  process.exit(0);
});

main();
