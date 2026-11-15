/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

function createContext({ socket, event, args, config }) {
  return {
    api: socket,
    event,
    args,
    config,

    reply: async text =>
      socket.sendMessage(event.threadID, { text: String(text) }),

    react: async emoji =>
      socket.sendMessage(event.threadID, {
        react: {
          text: emoji,
          key: event.raw.key
        }
      }),

    send: async content =>
      socket.sendMessage(event.threadID, content),

    sender: event.sender,
    threadID: event.threadID,
    messageID: event.messageID,
    isGroup: event.isGroup
  };
}

module.exports = { createContext };
