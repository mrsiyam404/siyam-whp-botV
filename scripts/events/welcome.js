
/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * WhatsApp Welcome Event
 * Version: 2.1
 */

const logger = require("../../src/logger");

const BOT_NAME = "𓆩[ , ]𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓";
const OWNER_NAME = "𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍";

function getJidNumber(jid = "") {
  return String(jid).split("@")[0].split(":")[0];
}

module.exports = {
  config: {
    name: "group-participants.update",
    version: "2.1",
    author: "𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍",
    category: "events"
  },

  run: async ({ socket, args }) => {
    const update = args[0];

    if (!update || update.action !== "add") return;

    const groupJid = update.id;
    const participants = update.participants || [];

    if (!groupJid || !participants.length) return;

    try {
      const metadata = await socket.groupMetadata(groupJid);
      const groupName = metadata.subject || "Group";
      const memberCount = metadata.participants?.length || 0;

      const botJid = socket.user?.id || "";
      const botNumber = getJidNumber(botJid);

      for (const participant of participants) {
        const userJid =
          typeof participant === "string"
            ? participant
            : participant.id;

        if (!userJid) continue;

        const userNumber = getJidNumber(userJid);
        const isBot = userNumber === botNumber;

        let text;

        if (isBot) {
          text =
`✨ 𝗕𝗢𝗧 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗 ✨
━━━━━━━━━━━━━━━━━━
👑 ${OWNER_NAME}

🤖 আমি ${BOT_NAME}
❤️ আমাকে গ্রুপে Add করার জন্য ধন্যবাদ।

📌 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢
» 👥 Members: ${memberCount}
» ⚙️ Prefix: ${" , "}

📖 𝗚𝗘𝗧 𝗦𝗧𝗔𝗥𝗧𝗘𝗗
» ,help — সকল কমান্ড দেখুন
» Owner: ${OWNER_NAME}

🌸 সবাইকে স্বাগতম।`;
        } else {
          text =
`🌸 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 🌸
━━━━━━━━━━━━━━━━━━
👋 স্বাগতম @${userNumber}

🏷️ Group: ${groupName}
👥 Members: ${memberCount}

🌷 আমাদের গ্রুপে তোমাকে স্বাগতম।
📜 গ্রুপের নিয়ম মেনে চলবে।
🤝 সবাইকে সম্মান করবে।

━━━━━━━━━━━━━━━━━━
👑 𝗢𝗪𝗡𝗘𝗥: ${OWNER_NAME}
🌸 Enjoy your stay!`;
        }

        await socket.sendMessage(groupJid, {
          text,
          mentions: [userJid]
        });
      }
    } catch (error) {
      logger.error(
        `Welcome event error: ${error.stack || error.message}`
      );
    }
  }
};
