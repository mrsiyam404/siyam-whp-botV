/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * Messenger UID command adapted for WhatsApp Baileys.
 */

module.exports = {
  config: {
    name: "uid",
    aliases: ["uid2", "ইউআইডি", "useid"],
    version: "6.0",
    author: "𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍",
    countDown: 3,
    role: 0,
    description: {
      en: "Get WhatsApp user UID"
    },
    category: "user"
  },

  run: async ({ api, event }) => {
    const sender = event.senderUID || event.sender;
    const mentions = event.mentions || [];

    const target = mentions.length
      ? mentions[0]
      : sender;

    if (!target) {
      return api.sendMessage(
        { text: "❌ WhatsApp UID পাওয়া যায়নি।" },
        event.threadID
      );
    }

    const text = [
      "╭━━━━━━━━━━━━━━━━╮",
      "       👑 𝐔𝐒𝐄𝐑 𝐔𝐈𝐃",
      "╰━━━━━━━━━━━━━━━━╯",
      "",
      `👤 𝐔𝐈𝐃: ${target}`,
      "",
      `📱 𝐂𝐇𝐀𝐓 𝐈𝐃: ${event.threadID}`,
      "",
      "👑 𝐎𝐖𝐍𝐄𝐑: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍",
      "━━━━━━━━━━━━━━━━━━"
    ].join("\n");

    return api.sendMessage(
      { text },
      event.threadID
    );
  }
};
