/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

function cleanPhone(number) {
  return String(number || "").replace(/\D/g, "");
}

function toWhatsAppJid(number) {
  const phone = cleanPhone(number);
  if (!phone) throw new Error("Phone number is required.");

  return `${phone}@s.whatsapp.net`;
}

function fromWhatsAppJid(jid) {
  return String(jid || "").split("@")[0].split(":")[0];
}

module.exports = {
  cleanPhone,
  toWhatsAppJid,
  fromWhatsAppJid
};
