/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * WhatsApp message compatibility adapter.
 */

function getMessageText(messageContent) {
  if (!messageContent) return "";

  return (
    messageContent.conversation ||
    messageContent.extendedTextMessage?.text ||
    messageContent.imageMessage?.caption ||
    messageContent.videoMessage?.caption ||
    messageContent.documentMessage?.caption ||
    messageContent.documentWithCaptionMessage?.message
      ?.documentMessage?.caption ||
    messageContent.buttonsResponseMessage?.selectedDisplayText ||
    messageContent.listResponseMessage?.title ||
    messageContent.templateButtonReplyMessage?.selectedDisplayText ||
    ""
  );
}

function normalizeMessage(message, socket) {
  const key = message.key || {};
  const remoteJid = key.remoteJid || "";

  const participant =
    key.participant ||
    key.participantAlt ||
    key.remoteJidAlt ||
    remoteJid;

  const messageContent = message.message || {};
  const messageType =
    Object.keys(messageContent)[0] || "unknown";

  const body = getMessageText(messageContent);

  const isGroup = remoteJid.endsWith("@g.us");
  const senderUID = String(participant || "").trim();
  const senderNumber = senderUID.split("@")[0];

  const contextInfo =
    messageContent.extendedTextMessage?.contextInfo ||
    messageContent.imageMessage?.contextInfo ||
    messageContent.videoMessage?.contextInfo ||
    messageContent.documentMessage?.contextInfo ||
    {};

  return {
    sender: senderUID,
    senderID: senderUID,
    senderUID,
    senderNumber,

    threadID: remoteJid,
    chatID: remoteJid,

    messageID: key.id || "",
    body,
    type: messageType,

    isGroup,
    isInbox: !isGroup,
    isFromMe: Boolean(key.fromMe),

    isOwner: false,
    isAdmin: false,
    isWhitelisted: false,

    mentions: contextInfo.mentionedJid || [],
    replyTo: contextInfo.stanzaId || null,

    raw: message,
    api: socket
  };
}

module.exports = { normalizeMessage };
