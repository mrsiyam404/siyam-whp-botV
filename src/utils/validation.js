/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

function isValidPhone(number) {
  return /^\d{8,15}$/.test(String(number).replace(/\D/g, ""));
}

function isValidPrefix(prefix) {
  return typeof prefix === "string" &&
    prefix.length > 0 &&
    prefix.length <= 5;
}

function isValidJid(jid) {
  return typeof jid === "string" &&
    /@(s\.whatsapp\.net|g\.us)$/.test(jid);
}

module.exports = { isValidPhone, isValidPrefix, isValidJid };
