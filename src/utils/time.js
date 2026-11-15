/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

function now() {
  return new Date();
}

function timestamp() {
  return Date.now();
}

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    dateStyle: "medium",
    timeStyle: "medium"
  }).format(date);
}

function uptime(startedAt) {
  const seconds = Math.floor((Date.now() - startedAt) / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;

  return `${hours}h ${minutes}m ${remaining}s`;
}

module.exports = { now, timestamp, formatDate, uptime };
