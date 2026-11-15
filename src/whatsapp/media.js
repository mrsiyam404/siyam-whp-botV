/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

async function downloadMedia(message, downloadContentFromMessage) {
  const content = message.message || {};
  const type = Object.keys(content).find(key =>
    ["imageMessage", "videoMessage", "audioMessage", "documentMessage"].includes(key)
  );

  if (!type) return null;

  const mediaType = type.replace("Message", "");
  const stream = await downloadContentFromMessage(
    content[type],
    mediaType
  );

  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

module.exports = { downloadMedia };
