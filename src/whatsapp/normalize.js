/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * WhatsApp message compatibility adapter.
 */

function normalizeMessage(message, socket) {
  const key = message.key || {};
  const remoteJid = key.remoteJid || "";
  const participant = key.participant || remoteJid;

  const messageContent = message.message || {};
  const messageType = Object.keys(messageContent)[0] || "unknown";

  const text =
    messageContent.conversation ||
    messageContent.extendedTextMessage?.text ||
    messageContent.imageMessage?.caption ||
    messageContent.videoMessage?.caption ||
    messageContent.documentMessage?.caption ||
    "";

  const isGroup = remoteJid.endsWith("@g.us");
  const sender = participant.split("@")[0];
  const chat = remoteJid;

  return {
    sender,
    senderID: sender,
    threadID: chat,
    chatID: chat,
    messageID: key.id || "",
    body: text,
    type: messageType,
    isGroup,
    isInbox: !isGroup,
    isFromMe: Boolean(key.fromMe),
    isAdmin: false,
    mentions: messageContent.extendedTextMessage?.contextInfo?.mentionedJid || [],
    replyTo: messageContent.extendedTextMessage?.contextInfo?.stanzaId || null,
    raw: message,
    api: socket
  };
}

module.exports = { normalizeMessage };
