/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

function safeString(value, fallback = "") {
  try {
    return String(value ?? fallback);
  } catch {
    return fallback;
  }
}

function safeJSON(value, fallback = {}) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function safeError(error) {
  return error?.stack || error?.message || String(error);
}

module.exports = { safeString, safeJSON, safeError };
