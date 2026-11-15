
/**
 * 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * Colorful Bengali + English console logger.
 */

const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m",
  white: "\x1b[37m"
};

const LEVELS = {
  info: { label: "INFO", color: COLORS.cyan },
  success: { label: "SUCCESS", color: COLORS.green },
  warn: { label: "WARNING", color: COLORS.yellow },
  error: { label: "ERROR", color: COLORS.red },
  debug: { label: "DEBUG", color: COLORS.magenta }
};

function write(level, message) {
  const item = LEVELS[level] || LEVELS.info;

  const time = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Dhaka",
    hour12: false
  });

  console.log(
    `${COLORS.blue}[${time}]${COLORS.reset} ` +
    `${item.color}${COLORS.bold}[${item.label}]${COLORS.reset} ` +
    `${String(message)}`
  );
}

function banner(lines) {
  console.log("");
  console.log(`${COLORS.magenta}${COLORS.bold}╔══════════════════════════════════════════════╗`);
  for (const line of lines) {
    console.log(`║ ${String(line).padEnd(44, " ")} ║`);
  }
  console.log("╚══════════════════════════════════════════════╝" + COLORS.reset);
  console.log("");
}

module.exports = {
  info: message => write("info", message),
  success: message => write("success", message),
  warn: message => write("warn", message),
  error: message => write("error", message),
  debug: message => write("debug", message),
  banner
};
