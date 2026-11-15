/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * WhatsApp UID-based permission system.
 */

function normalizeUID(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^@/, "");
}

function getUIDVariants(value) {
  const uid = normalizeUID(value);

  if (!uid) return [];

  const variants = [uid];

  if (uid.includes("@")) {
    const number = uid.split("@")[0];

    if (/^\d+$/.test(number)) {
      variants.push(number);
      variants.push(`${number}@s.whatsapp.net`);
      variants.push(`${number}@lid`);
    }
  }

  if (/^\d+$/.test(uid)) {
    variants.push(`${uid}@s.whatsapp.net`);
    variants.push(`${uid}@lid`);
  }

  return [...new Set(variants)];
}

function matchesUID(sender, allowedList) {
  if (!Array.isArray(allowedList)) return false;

  const senderVariants = getUIDVariants(sender);

  if (!senderVariants.length) return false;

  return allowedList.some(item => {
    const allowedVariants = getUIDVariants(item);

    return allowedVariants.some(uid =>
      senderVariants.includes(uid)
    );
  });
}

function isOwner(sender, config) {
  return (
    matchesUID(sender, config.owner?.numbers) ||
    matchesUID(sender, config.owner?.uids)
  );
}

function isAdmin(sender, config) {
  return (
    isOwner(sender, config) ||
    matchesUID(sender, config.admins)
  );
}

function isWhitelisted(sender, config) {
  return matchesUID(sender, config.whitelist);
}

function normalize(sender) {
  return normalizeUID(sender);
}

module.exports = {
  isOwner,
  isAdmin,
  isWhitelisted,
  normalize,
  normalizeUID,
  getUIDVariants
};
