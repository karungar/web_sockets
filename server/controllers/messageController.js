const { v4: uuidv4 } = require('uuid');

module.exports = function messageController(socket, io, store) {
  // Always access through store
  const { users, messages } = store;

  socket.on('send_message', ({ roomId, content, type = 'text' }) => {
    const user = users.get(socket.id);
    if (!user) return;

    const message = {
      id: uuidv4(),
      userId: socket.id,
      username: user.username,
      avatar: user.avatar,
      content,
      type,
      timestamp: new Date(),
      reactions: {},
      readBy: [socket.id]
    };

    // Store message
    if (!messages.has(roomId)) messages.set(roomId, []);
    messages.get(roomId).push(message);

    // Broadcast message
    io.to(roomId).emit('new_message', message);
  });

  socket.on('send_private_message', ({ recipientId, content }) => {
    const user = users.get(socket.id);
    const recipient = users.get(recipientId);
    if (!user || !recipient) return;

    const message = {
      id: uuidv4(),
      senderId: socket.id,
      recipientId,
      senderName: user.username,
      senderAvatar: user.avatar,
      content,
      timestamp: new Date(),
      isPrivate: true
    };

    // Send to both users
    socket.emit('private_message', message);
    socket.to(recipientId).emit('private_message', message);
  });

  // Message reactions (fixed to use store)
  socket.on('add_reaction', ({ messageId, roomId, emoji }) => {
    const user = users.get(socket.id);
    if (!user) return;

    const roomMessages = messages.get(roomId);
    if (!roomMessages) return;

    const message = roomMessages.find(msg => msg.id === messageId);
    if (!message) return;

    if (!message.reactions[emoji]) {
      message.reactions[emoji] = [];
    }

    const existingReaction = message.reactions[emoji].find(r => r.userId === socket.id);
    if (!existingReaction) {
      message.reactions[emoji].push({
        userId: socket.id,
        username: user.username
      });
    }

    io.to(roomId).emit('reaction_added', {
      messageId,
      emoji,
      reactions: message.reactions
    });
  });
  
  // Search messages (fixed to use store)
  socket.on('search_messages', ({ roomId, query }) => {
    const roomMessages = messages.get(roomId) || [];
    const searchResults = roomMessages.filter(msg => 
      msg.content.toLowerCase().includes(query.toLowerCase())
    );
    
    socket.emit('search_results', searchResults);
  });
};