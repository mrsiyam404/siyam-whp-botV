/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

function getMentions(message) {
  return message.message?.extendedTextMessage
    ?.contextInfo?.mentionedJid || [];
}

function formatMention(jid) {
  return `@${String(jid).split("@")[0]}`;
}

function buildMentionText(numbers) {
  return numbers.map(formatMention).join(" ");
}

module.exports = { getMentions, formatMention, buildMentionText };
