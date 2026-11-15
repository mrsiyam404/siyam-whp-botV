/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

async function getGroupMetadata(socket, groupId) {
  return socket.groupMetadata(groupId);
}

async function getGroupParticipants(socket, groupId) {
  const metadata = await getGroupMetadata(socket, groupId);
  return metadata.participants || [];
}

async function updateGroupSubject(socket, groupId, subject) {
  return socket.groupUpdateSubject(groupId, subject);
}

async function updateGroupDescription(socket, groupId, description) {
  return socket.groupUpdateDescription(groupId, description);
}

async function updateGroupMembers(socket, groupId, participants, action) {
  return socket.groupParticipantsUpdate(groupId, participants, action);
}

module.exports = {
  getGroupMetadata,
  getGroupParticipants,
  updateGroupSubject,
  updateGroupDescription,
  updateGroupMembers
};
