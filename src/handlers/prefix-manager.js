/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

const fs = require("fs");
const path = require("path");

function changePrefix(prefix, config) {
  if (typeof prefix !== "string" || !prefix.trim()) {
    throw new Error("Invalid prefix.");
  }

  config.bot.prefix = prefix.trim();

  const configPath = path.resolve(__dirname, "../../config.json");
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  return config.bot.prefix;
}

module.exports = { changePrefix };
