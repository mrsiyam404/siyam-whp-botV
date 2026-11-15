/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 * Messenger welcome event adapted for WhatsApp Baileys.
 */

module.exports = {
  config: {
    name: "group-participants.update",
    version: "2.1",
    author: "𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍",
    category: "events"
  },

  run: async ({ socket, args }) => {
    const update = args[0];

    if (!update) return;
    if (update.action !== "add") return;

    const groupJid = update.id;
    const participants = update.participants || [];

    if (!groupJid || !groupJid.endsWith("@g.us")) return;
    if (!participants.length) return;

    let groupName = "Our Group";
    let memberCount = 0;

    try {
      const metadata = await socket.groupMetadata(groupJid);

      groupName = metadata.subject || groupName;
      memberCount = metadata.participants?.length || 0;
    } catch (error) {
      console.error("[WELCOME] Group metadata:", error.message);
    }

    for (const participant of participants) {
      const userJid = String(participant || "");

      if (!userJid) continue;

      const botJid = socket.user?.id || "";
      const botNumber = botJid.split(":")[0].split("@")[0];
      const participantNumber = userJid.split(":")[0].split("@")[0];

      const isBot = Boolean(
        botNumber &&
        participantNumber &&
        botNumber === participantNumber
      );

      let welcomeText;

      if (isBot) {
        welcomeText = [
          "✨ 𝗕𝗢𝗧 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗 ✨",
          "──────────────────",
          "👋 হ্যালো সবাই!",
          "🤖 আমাকে গ্রুপে Add করার জন্য ধন্যবাদ।",
          "",
          "📌 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢",
          `» 👥 𝗠𝗘𝗠𝗕𝗘𝗥𝗦 : ${memberCount}`,
          "» 🤖 𝗣𝗥𝗘𝗙𝗜𝗫 : ,",
          "",
          "📖 𝗚𝗘𝗧 𝗦𝗧𝗔𝗥𝗧𝗘𝗗",
          "» ,help — সকল কমান্ড দেখুন",
          "",
          "👑 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
          "──────────────────",
          "🌸 সবাইকে স্বাগতম"
        ].join("\n");
      } else {
        welcomeText = [
          "🌸 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 🌸",
          "━━━━━━━━━━━━━━━━",
          `👤 @${participantNumber}`,
          `🏷️ 𝐆𝐫𝐨𝐮𝐩: ${groupName}`,
          `🔢 𝐌𝐞𝐦𝐛𝐞𝐫𝐬: ${memberCount}`,
          "━━━━━━━━━━━━━━━━",
          "🌷 আমাদের গ্রুপে তোমাকে স্বাগতম!",
          "😊 গ্রুপের নিয়ম মেনে চলবে।",
          "💖 Enjoy your stay!",
          "━━━━━━━━━━━━━━━━",
          "👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍"
        ].join("\n");
      }

      try {
        await socket.sendMessage(groupJid, {
          text: welcomeText,
          mentions: isBot ? [] : [userJid]
        });
      } catch (error) {
        console.error(
          "[WELCOME ERROR]",
          error.stack || error.message
        );
      }
    }
  }
};
