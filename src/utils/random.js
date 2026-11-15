/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

const crypto = require("crypto");

function randomId(length = 12) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(items = []) {
  if (!items.length) return null;
  return items[randomNumber(0, items.length - 1)];
}

module.exports = { randomId, randomNumber, randomItem };
