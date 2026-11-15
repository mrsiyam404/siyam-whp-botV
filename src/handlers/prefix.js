/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

function parsePrefix(text, config) {
  const body = String(text || "").trim();
  const prefix = config.bot.prefix || ",";

  if (body.startsWith(prefix)) {
    return {
      matched: true,
      prefix,
      commandText: body.slice(prefix.length).trim()
    };
  }

  if (config.bot.noPrefix?.enabled) {
    return {
      matched: true,
      prefix: "",
      commandText: body
    };
  }

  return { matched: false, prefix: null, commandText: "" };
}

module.exports = { parsePrefix };
