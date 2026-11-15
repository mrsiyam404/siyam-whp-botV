
/**
 * 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * Safer WhatsApp UID permission system.
 */

function normalizeUID(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^@/, "");
}

function getExactUID(value) {
  const uid = normalizeUID(value);
  if (!uid) return "";

  // Keep complete WhatsApp JIDs unchanged.
  if (uid.includes("@")) return uid;

  // A plain numeric UID remains plain numeric.
  return uid;
}

function getComparableUID(value) {
  const uid = normalizeUID(value);
  if (!uid) return "";

  // Compare only the actual numeric part.
  // Do not invent a PN <-> LID mapping.
  return uid.split("@")[0];
}

function matchesUID(sender, allowedList, alternatives = []) {
  if (!Array.isArray(allowedList)) return false;

  const senderIDs = [sender, ...alternatives]
    .map(getExactUID)
    .filter(Boolean);

  if (!senderIDs.length) return false;

  const senderNumbers = senderIDs
    .map(getComparableUID)
    .filter(Boolean);

  return allowedList.some(item => {
    const allowed = getExactUID(item);
    if (!allowed) return false;

    // Full JID configuration requires exact JID match.
    if (allowed.includes("@")) {
      return senderIDs.includes(allowed);
    }

    // Plain numeric UID matches the same numeric identity
    // supplied by WhatsApp, without generating another JID.
    return senderNumbers.includes(allowed);
  });
}

function isOwner(sender, config, alternatives = []) {
  return (
    matchesUID(sender, config.owner?.numbers, alternatives) ||
    matchesUID(sender, config.owner?.uids, alternatives)
  );
}

function isAdmin(sender, config, alternatives = []) {
  return (
    isOwner(sender, config, alternatives) ||
    matchesUID(sender, config.admins, alternatives)
  );
}

function isWhitelisted(sender, config, alternatives = []) {
  return matchesUID(sender, config.whitelist, alternatives);
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
  getExactUID,
  getComparableUID,
  matchesUID
};
