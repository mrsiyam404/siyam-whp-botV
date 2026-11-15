/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

function unique(items = []) {
  return [...new Set(items)];
}

function chunk(items = [], size = 10) {
  const output = [];

  for (let i = 0; i < items.length; i += size) {
    output.push(items.slice(i, i + size));
  }

  return output;
}

function shuffle(items = []) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

module.exports = { unique, chunk, shuffle };
