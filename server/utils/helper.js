function updateRoomUsers(io, store, roomId) {
  const room = store.rooms.get(roomId);
  if (!room) return;
  
  const roomUsers = Array.from(room.users)
    .map(userId => store.users.get(userId))
    .filter(Boolean);
  
  io.to(roomId).emit('room_users', roomUsers);
}

module.exports = {
  updateRoomUsers
};