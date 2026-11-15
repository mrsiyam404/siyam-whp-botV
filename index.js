
/**
 * 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * Main WhatsApp Bot Launcher.
 */

const fs = require("fs");
const path = require("path");

const { loadConfig } = require("./src/config");
const logger = require("./src/logger");
const { startWhatsApp } = require("./src/whatsapp/client");
const { verifyProject } = require("./src/security/integrity");

function getPackageInfo() {
  try {
    const packagePath = path.join(__dirname, "package.json");
    return JSON.parse(fs.readFileSync(packagePath, "utf8"));
  } catch {
    return {};
  }
}

async function main() {
  try {
    const config = loadConfig();
    const pkg = getPackageInfo();

    logger.banner([
      "👑 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍",
      "🤖 " + (config.bot?.name || "WhatsApp Bot"),
      "📦 Version: " + (pkg.version || "Unknown"),
      "🛠️ Platform: WhatsApp / Baileys",
      "🌐 Runtime: Node.js " + process.version,
      "🕒 Timezone: " + (config.timezone || "Asia/Dhaka"),
      "⚙️ Prefix: " + (config.bot?.prefix || ","),
      "🚀 Status: Starting..."
    ]);

    logger.info("বাংলা: বট চালু করার প্রস্তুতি চলছে...");
    logger.info("English: Initializing bot services...");

    if (config.security?.integrityCheck) {
      logger.info("🔐 Checking project file integrity...");

      const result = await verifyProject(config);

      if (!result.valid) {
        logger.warn(
          `⚠️ Integrity Warning: ${result.invalidFiles.length} file(s) failed verification.`
        );

        for (const file of result.invalidFiles) {
          logger.error(`❌ Modified / Invalid File: ${file}`);
        }

        logger.warn(
          "বাংলা: Author marker না মেলা ফাইলগুলো লোড নাও হতে পারে।"
        );
      } else {
        logger.success(
          `✅ Integrity Passed: ${result.checkedFiles} file(s) checked.`
        );
      }
    }

    logger.info("📡 WhatsApp connection service starting...");
    await startWhatsApp(config);

  } catch (error) {
    logger.error("❌ Startup Error / চালু করতে সমস্যা হয়েছে!");
    logger.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

process.on("unhandledRejection", error => {
  logger.error("❌ Unhandled Promise Rejection:");
  logger.error(error?.stack || error);
});

process.on("uncaughtException", error => {
  logger.error("❌ Uncaught Exception:");
  logger.error(error?.stack || error);
  process.exit(1);
});

process.on("SIGINT", () => {
  logger.warn("🛑 Bot বন্ধ করা হচ্ছে... Shutting down.");
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.warn("🛑 Deployment is stopping the bot...");
  process.exit(0);
});

main();
