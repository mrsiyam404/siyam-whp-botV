/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

const ROLE = {
  USER: 0,
  ADMIN: 1,
  OWNER: 2
};

function hasRole(sender, requiredRole, config) {
  const { isOwner, isAdmin } = require("./access");

  if (requiredRole === ROLE.USER) return true;
  if (requiredRole === ROLE.ADMIN) return isAdmin(sender, config);
  if (requiredRole === ROLE.OWNER) return isOwner(sender, config);

  return false;
}

module.exports = { ROLE, hasRole };
