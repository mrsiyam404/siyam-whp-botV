/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

const users = require("../database/users");

function isBanned(sender) {
  return Boolean(users.getUser(sender).banned);
}

function ban(sender, reason) {
  return users.banUser(sender, reason);
}

function unban(sender) {
  return users.unbanUser(sender);
}

module.exports = { isBanned, ban, unban };
