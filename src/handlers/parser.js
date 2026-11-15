/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

function parseCommand(text) {
  const input = String(text || "").trim();
  if (!input) return null;

  const parts = input.match(/"[^"]+"|'[^']+'|\S+/g) || [];
  const command = parts.shift();

  return {
    name: command.toLowerCase(),
    args: parts.map(value => value.replace(/^["']|["']$/g, "")),
    raw: input
  };
}

module.exports = { parseCommand };
