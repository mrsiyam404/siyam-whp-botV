/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

const JSONDatabase = require("./json");
const database = new JSONDatabase("groups.json");

function getGroup(id) {
  return database.get(id) || {
    id,
    enabled: true,
    prefix: null,
    admins: []
  };
}

function updateGroup(id, values) {
  return database.set(id, {
    ...getGroup(id),
    ...values
  });
}

function setGroupPrefix(id, prefix) {
  return updateGroup(id, { prefix });
}

module.exports = { getGroup, updateGroup, setGroupPrefix };
