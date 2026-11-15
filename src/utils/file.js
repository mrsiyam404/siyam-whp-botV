/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

const fs = require("fs");
const path = require("path");

function ensureDirectory(directory) {
  fs.mkdirSync(directory, { recursive: true });
  return directory;
}

function exists(file) {
  return fs.existsSync(file);
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function writeText(file, content) {
  ensureDirectory(path.dirname(file));
  fs.writeFileSync(file, content);
}

function removeFile(file) {
  if (exists(file)) fs.unlinkSync(file);
}

module.exports = {
  ensureDirectory,
  exists,
  readText,
  writeText,
  removeFile
};
