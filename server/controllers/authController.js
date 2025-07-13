module.exports = function authController(socket, io, store) {
  socket.on('authenticate', ({ username, avatar }) => {
    const { users, rooms, messages } = store;
    const user = {
      id: socket.id,
      username,
      avatar,
      isOnline: true,
      lastSeen: new Date(),
      currentRoom: 'general'
    };
    
    users.set(socket.id, user);
    socket.join('general');
    
    const generalRoom = rooms.get('general');
    if (generalRoom) {
      generalRoom.users.add(socket.id);
    }
    
    socket.emit('authenticated', user);
    socket.to('general').emit('user_joined', user);
    
    // Get messages from messages store (not room object)
    const roomMessages = messages.get('general') || [];
    socket.emit('room_messages', roomMessages);
  });
};