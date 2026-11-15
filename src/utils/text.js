/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

function shorten(text, limit = 1000) {
  const value = String(text || "");
  return value.length > limit
    ? `${value.slice(0, limit - 3)}...`
    : value;
}

function capitalize(text) {
  const value = String(text || "");
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function removeExtraSpaces(text) {
  return String(text || "").trim().replace(/\s+/g, " ");
}

module.exports = { shorten, capitalize, removeExtraSpaces };
