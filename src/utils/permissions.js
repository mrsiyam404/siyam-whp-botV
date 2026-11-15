/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

function canUseNoPrefix(sender, config) {
  if (!config.bot.noPrefix?.enabled) return false;

  if (!config.bot.noPrefix.adminOnly) return true;

  const { isAdmin } = require("../permissions/access");
  return isAdmin(sender, config);
}

function canManageGroup(sender, metadata) {
  const participant = metadata.participants?.find(
    item => item.id === sender
  );

  return Boolean(
    participant?.admin === "admin" ||
    participant?.admin === "superadmin"
  );
}

module.exports = { canUseNoPrefix, canManageGroup };
