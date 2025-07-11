module.exports = function userController(socket, io, store) {
  socket.on('typing', ({ roomId, isTyping }) => {
    const { users } = store;
    const user = users.get(socket.id);
    if (!user) return;

    socket.to(roomId).emit('user_typing', {
      userId: socket.id,
      username: user.username,
      isTyping
    });
  });
};