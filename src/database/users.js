/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

const JSONDatabase = require("./json");
const database = new JSONDatabase("users.json");

function getUser(id) {
  return database.get(id) || {
    id,
    banned: false,
    warnings: 0,
    commandsUsed: 0
  };
}

function updateUser(id, values) {
  return database.set(id, {
    ...getUser(id),
    ...values
  });
}

function banUser(id, reason = "No reason provided") {
  return updateUser(id, { banned: true, banReason: reason });
}

function unbanUser(id) {
  return updateUser(id, { banned: false, banReason: null });
}

module.exports = { getUser, updateUser, banUser, unbanUser };
