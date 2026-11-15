/**
 * WhatsApp Bot Core
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

const { loadConfig } = require("./src/config");
const logger = require("./src/logger");
const { startWhatsApp } = require("./src/whatsapp/client");
const { verifyProject } = require("./src/security/integrity");

async function main() {
  try {
    const config = loadConfig();

    logger.info("𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍 WhatsApp Bot starting...");

    if (config.security?.integrityCheck) {
      const result = await verifyProject(config);

      if (!result.valid) {
        logger.warn(
          `Integrity warning: ${result.invalidFiles.length} file(s) failed verification.`
        );
        logger.warn("Modified files will be blocked individually.");
      }
    }

    await startWhatsApp(config);
  } catch (error) {
    logger.error(`Startup error: ${error.stack || error.message}`);
    process.exitCode = 1;
  }
}

process.on("unhandledRejection", error => {
  logger.error(`Unhandled rejection: ${error?.stack || error}`);
});

process.on("uncaughtException", error => {
  logger.error(`Uncaught exception: ${error?.stack || error}`);
  process.exit(1);
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
