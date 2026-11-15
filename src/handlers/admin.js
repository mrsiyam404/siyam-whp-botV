/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

const { isOwner, isAdmin } = require("../permissions/access");

function requireAdmin(sender, config) {
  return isAdmin(sender, config);
}

function requireOwner(sender, config) {
  return isOwner(sender, config);
}

function addAdmin(number, config) {
  const value = String(number).replace(/\D/g, "");

  if (!value || config.admins.includes(value)) return false;

  config.admins.push(value);
  return true;
}

function removeAdmin(number, config) {
  const value = String(number).replace(/\D/g, "");
  const index = config.admins.indexOf(value);

  if (index === -1) return false;

  config.admins.splice(index, 1);
  return true;
}

module.exports = {
  requireAdmin,
  requireOwner,
  addAdmin,
  removeAdmin
};
