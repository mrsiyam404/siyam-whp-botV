/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

const fs = require("fs");
const path = require("path");

class JSONDatabase {
  constructor(filename = "database.json") {
    this.file = path.resolve(__dirname, "../../database", filename);
    fs.mkdirSync(path.dirname(this.file), { recursive: true });

    if (!fs.existsSync(this.file)) {
      fs.writeFileSync(this.file, "{}");
    }
  }

  read() {
    try {
      return JSON.parse(fs.readFileSync(this.file, "utf8"));
    } catch {
      return {};
    }
  }

  write(data) {
    fs.writeFileSync(this.file, JSON.stringify(data, null, 2));
  }

  get(key) {
    return this.read()[key];
  }

  set(key, value) {
    const data = this.read();
    data[key] = value;
    this.write(data);
    return value;
  }

  delete(key) {
    const data = this.read();
    delete data[key];
    this.write(data);
  }
}

module.exports = JSONDatabase;
