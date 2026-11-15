/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

const cooldowns = new Map();

function checkCooldown(user, command, seconds = 3) {
  const key = `${user}:${command}`;
  const now = Date.now();
  const last = cooldowns.get(key) || 0;
  const remaining = seconds * 1000 - (now - last);

  if (remaining > 0) {
    return { allowed: false, remaining: Math.ceil(remaining / 1000) };
  }

  cooldowns.set(key, now);
  return { allowed: true, remaining: 0 };
}

function clearCooldown(user, command) {
  cooldowns.delete(`${user}:${command}`);
}

module.exports = { checkCooldown, clearCooldown };
