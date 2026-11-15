/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

function normalize(number) {
  return String(number || "").replace(/\D/g, "");
}

function isOwner(sender, config) {
  return config.owner.numbers.some(
    number => normalize(number) === normalize(sender)
  );
}

function isAdmin(sender, config) {
  return isOwner(sender, config) ||
    config.admins.some(
      number => normalize(number) === normalize(sender)
    );
}

function isWhitelisted(sender, config) {
  return config.whitelist.some(
    number => normalize(number) === normalize(sender)
  );
}

module.exports = { isOwner, isAdmin, isWhitelisted, normalize };
