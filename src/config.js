/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.resolve(__dirname, "../config.json");

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error("config.json was not found.");
  }

  let config;

  try {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  } catch {
    throw new Error("config.json contains invalid JSON.");
  }

  if (!config.bot) {
    throw new Error("Missing bot configuration.");
  }

  if (!config.bot.prefix) {
    config.bot.prefix = ",";
  }

  if (!Array.isArray(config.owner?.numbers)) {
    throw new Error("owner.numbers must be an array.");
  }

  if (!Array.isArray(config.admins)) {
    throw new Error("admins must be an array.");
  }

  if (!Array.isArray(config.whitelist)) {
    throw new Error("whitelist must be an array.");
  }

  return config;
}

module.exports = { loadConfig };
