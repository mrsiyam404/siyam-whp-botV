/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

const levels = {
  info: "INFO",
  success: "SUCCESS",
  warn: "WARNING",
  error: "ERROR",
  debug: "DEBUG"
};

function write(level, message) {
  const label = levels[level] || "LOG";
  const time = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Dhaka"
  });

  console.log(`[${time}] [${label}] ${message}`);
}

module.exports = {
  info: message => write("info", message),
  success: message => write("success", message),
  warn: message => write("warn", message),
  error: message => write("error", message),
  debug: message => write("debug", message)
};
