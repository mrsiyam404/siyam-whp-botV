/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * Admin permission and persistent admin management.
 */

const fs = require("fs");
const path = require("path");
const { isOwner, isAdmin } = require("../permissions/access");

const CONFIG_PATH = path.resolve(__dirname, "../../config.json");

function normalizeNumber(number) {
  return String(number || "").replace(/\D/g, "");
}

function requireAdmin(sender, config) {
  return isAdmin(sender, config);
}

function requireOwner(sender, config) {
  return isOwner(sender, config);
}

function saveConfig(config) {
  const temporaryPath = `${CONFIG_PATH}.tmp`;

  fs.writeFileSync(
    temporaryPath,
    JSON.stringify(config, null, 2) + "\n",
    "utf8"
  );

  fs.renameSync(temporaryPath, CONFIG_PATH);
}

function addAdmin(number, config) {
  const value = normalizeNumber(number);

  if (!value) return false;

  if (!Array.isArray(config.admins)) {
    config.admins = [];
  }

  const alreadyExists = config.admins.some(
    item => normalizeNumber(item) === value
  );

  if (alreadyExists) return false;

  config.admins.push(value);

  try {
    saveConfig(config);
    return true;
  } catch (error) {
    config.admins.pop();
    throw error;
  }
}

function removeAdmin(number, config) {
  const value = normalizeNumber(number);

  if (!value || !Array.isArray(config.admins)) return false;

  const index = config.admins.findIndex(
    item => normalizeNumber(item) === value
  );

  if (index === -1) return false;

  const removed = config.admins.splice(index, 1)[0];

  try {
    saveConfig(config);
    return true;
  } catch (error) {
    config.admins.splice(index, 0, removed);
    throw error;
  }
}

module.exports = {
  requireAdmin,
  requireOwner,
  addAdmin,
  removeAdmin
};
