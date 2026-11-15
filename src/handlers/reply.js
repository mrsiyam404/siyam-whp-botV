/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

async function reply(socket, event, text) {
  return socket.sendMessage(
    event.threadID,
    { text: String(text) },
    {
      quoted: event.raw
    }
  );
}

async function react(socket, event, emoji) {
  return socket.sendMessage(event.threadID, {
    react: {
      text: emoji,
      key: event.raw.key
    }
  });
}

module.exports = { reply, react };
