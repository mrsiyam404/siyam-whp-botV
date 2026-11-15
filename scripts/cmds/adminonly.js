const fs = require("fs");
const path = require("path");

const AUTHOR = "𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍";
const CONFIG_PATH = path.resolve(__dirname, "../../config.json");

module.exports = {
  config: {
    name: "adminonly",
    aliases: ["adonly", "onlyad", "onlyadmin", "vip"],
    version: "3.2",
    author: AUTHOR,
    countDown: 5,
    role: 2,
    description: {
      en: "Toggle admin-only mode"
    },
    category: "owner"
  },

  run: async ({ api, event, args, config }) => {
    const chatJid = event.threadID;
    const action = String(args[0] || "").toLowerCase();

    if (!["on", "off"].includes(action)) {
      return api.sendMessage(chatJid, {
        text:
`⚙️ 𝐀𝐃𝐌𝐈𝐍 𝐎𝐍𝐋𝐘
━━━━━━━━━━━━━━━━━━
ব্যবহার:
,adminonly on
,adminonly off
━━━━━━━━━━━━━━━━━━
👑 𝐎𝐖𝐍𝐄𝐑: ${AUTHOR}`
      });
    }

    const enabled = action === "on";

    try {
      config.adminOnly = config.adminOnly || {};
      config.adminOnly.enable = enabled;

      fs.writeFileSync(
        CONFIG_PATH,
        JSON.stringify(config, null, 2),
        "utf8"
      );

      const text = enabled
        ? `» 👑 ${AUTHOR}
━━━━━━━━━━━━━━━━━━
» 🔐 𝐀𝐃𝐌𝐈𝐍 𝐎𝐍𝐋𝐘 𝐎𝐍
» 🚫 এখন Admin ছাড়া
» 🤖 অন্য কেউ বট ব্যবহার করতে পারবে না।
━━━━━━━━━━━━━━━━━━
» 𝐕𝐄𝐑𝐒𝐈𝐎𝐍: 3.2`
        : `» 👑 ${AUTHOR}
━━━━━━━━━━━━━━━━━━
» 🔓 𝐀𝐃𝐌𝐈𝐍 𝐎𝐍𝐋𝐘 𝐎𝐅𝐅
» ✅ এখন আগের নিয়মে
» 🤖 বট ব্যবহার করা যাবে।
━━━━━━━━━━━━━━━━━━
» 𝐕𝐄𝐑𝐒𝐈𝐎𝐍: 3.2`;

      return api.sendMessage(chatJid, { text });
    } catch (error) {
      return api.sendMessage(chatJid, {
        text: `❌ Admin Only সেটিংস সংরক্ষণ করা যায়নি: ${error.message}`
      });
    }
  }
};
