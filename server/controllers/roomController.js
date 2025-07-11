const { updateRoomUsers } = require('../utils/helper');

module.exports = function roomController(socket, io, store) {
  socket.on('join_room', ({ roomId }) => {
    const { users, rooms } = store;
    const user = users.get(socket.id);
    if (!user) return;

    // Leave current room
    const currentRoom = rooms.get(user.currentRoom);
    if (currentRoom) {
      socket.leave(user.currentRoom);
      currentRoom.users.delete(socket.id);
      socket.to(user.currentRoom).emit('user_left', user);
      updateRoomUsers(io, store, user.currentRoom);
    }

    // Join new room
    socket.join(roomId);
    user.currentRoom = roomId;
    
    const room = rooms.get(roomId);
    if (room) {
      room.users.add(socket.id);
      socket.to(roomId).emit('user_joined', user);
      updateRoomUsers(io, store, roomId);
      
      // Send existing messages
      const roomMessages = store.messages.get(roomId) || [];
      socket.emit('room_messages', roomMessages);
    }
  });

  socket.on('get_rooms', () => {
    const roomList = Array.from(store.rooms.values()).map(room => ({
      id: room.id,
      name: room.name,
      userCount: room.users.size
    }));
    socket.emit('room_list', roomList);
  });
};