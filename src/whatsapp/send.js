/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

async function sendText(socket, jid, text, options = {}) {
  return socket.sendMessage(
    jid,
    { text: String(text) },
    options
  );
}

async function sendImage(socket, jid, image, caption = "") {
  return socket.sendMessage(jid, {
    image,
    caption
  });
}

async function sendVideo(socket, jid, video, caption = "") {
  return socket.sendMessage(jid, {
    video,
    caption
  });
}

async function sendDocument(socket, jid, document, fileName, mimetype) {
  return socket.sendMessage(jid, {
    document,
    fileName,
    mimetype
  });
}

module.exports = { sendText, sendImage, sendVideo, sendDocument };
