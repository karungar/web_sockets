const authController = require('../controllers/authController');
const roomController = require('../controllers/roomController');
const messageController = require('../controllers/messageController');
const userController = require('../controllers/userController');
const { updateRoomUsers } = require('../utils/helper');

module.exports = function socketHandlers(io, store) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Register controllers
    authController(socket, io, store);
    roomController(socket, io, store);
    messageController(socket, io, store);
    userController(socket, io, store);

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      const { users, rooms } = store;
      const user = users.get(socket.id);
      
      if (user) {
        // Handle room exit
        const currentRoom = rooms.get(user.currentRoom);
        if (currentRoom) {
          currentRoom.users.delete(socket.id);
          socket.to(user.currentRoom).emit('user_left', user);
          updateRoomUsers(io, store, user.currentRoom);
        }
        
        // Update user status
        user.isOnline = false;
        user.lastSeen = new Date();
        
        // Cleanup after delay
        setTimeout(() => {
          users.delete(socket.id);
        }, 30000);
      }
    });
  });
};