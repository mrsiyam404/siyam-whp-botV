/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

function createEventContext(socket, config, message) {
  return {
    api: socket,
    config,
    message,

    sendMessage: (jid, text) =>
      socket.sendMessage(jid, { text: String(text) }),

    sendToChat: text =>
      socket.sendMessage(message.key.remoteJid, {
        text: String(text)
      }),

    isGroup: message.key.remoteJid.endsWith("@g.us"),
    sender: message.key.participant || message.key.remoteJid
  };
}

module.exports = { createEventContext };
