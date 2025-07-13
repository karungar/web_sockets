const { v4: uuidv4 } = require('uuid');

// Initialize data structures
const users = new Map();
const rooms = new Map();
const messages = new Map();

// Create default rooms
function initializeDefaultRooms() {
  const defaultRooms = ['general', 'random', 'tech'];
  defaultRooms.forEach(room => {
    // Store room metadata without messages array
    rooms.set(room, {
      id: room,
      name: room.charAt(0).toUpperCase() + room.slice(1),
      users: new Set(),
      createdAt: new Date()
    });
    
    // Initialize empty message store for room
    messages.set(room, []);
  });
}

module.exports = {
  users,
  rooms,
  messages,
  initializeDefaultRooms,
  uuidv4
};