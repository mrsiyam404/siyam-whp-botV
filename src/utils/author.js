/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

const AUTHOR = "𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍";

function getAuthor() {
  return AUTHOR;
}

function authorFooter() {
  return `\n\n━━━━━━━━━━━━━━\n${AUTHOR}`;
}

function addAuthor(text) {
  return `${String(text || "")}${authorFooter()}`;
}

module.exports = {
  AUTHOR,
  getAuthor,
  authorFooter,
  addAuthor
};
