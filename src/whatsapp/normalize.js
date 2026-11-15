
/**
 * 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * WhatsApp message and sender identity normalizer.
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
  const remoteJid = String(key.remoteJid || "");

  const isGroup = remoteJid.endsWith("@g.us");

  // In groups, sender is the participant.
  // In private chats, sender is the remote JID.
  const primarySender = isGroup
    ? (key.participant || key.participantAlt || "")
    : remoteJid;

  // Preserve WhatsApp's alternate identity only when provided.
  const alternateSender = isGroup
    ? (key.participantAlt || "")
    : (key.remoteJidAlt || "");

  const senderUID = String(primarySender || "").trim();
  const senderAltUID = String(alternateSender || "").trim();

  const messageContent = message.message || {};
  const messageType =
    Object.keys(messageContent)[0] || "unknown";

  const body = getMessageText(messageContent);

  const contextInfo =
    messageContent.extendedTextMessage?.contextInfo ||
    messageContent.imageMessage?.contextInfo ||
    messageContent.videoMessage?.contextInfo ||
    messageContent.documentMessage?.contextInfo ||
    messageContent.documentWithCaptionMessage?.message
      ?.documentMessage?.contextInfo ||
    {};

  const senderNumber = senderUID.split("@")[0];

  return {
    sender: senderUID,
    senderID: senderUID,
    senderUID,
    senderAltUID,
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
