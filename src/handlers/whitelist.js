/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

function addWhitelist(number, config) {
  const value = String(number).replace(/\D/g, "");

  if (!value || config.whitelist.includes(value)) return false;

  config.whitelist.push(value);
  return true;
}

function removeWhitelist(number, config) {
  const value = String(number).replace(/\D/g, "");
  const index = config.whitelist.indexOf(value);

  if (index === -1) return false;

  config.whitelist.splice(index, 1);
  return true;
}

function checkWhitelist(number, config) {
  const value = String(number).replace(/\D/g, "");
  return config.whitelist.includes(value);
}

module.exports = {
  addWhitelist,
  removeWhitelist,
  checkWhitelist
};
