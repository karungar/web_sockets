class InMemoryStore {
  constructor() {
    this.users = new Map();
    this.rooms = new Map();
    this.messages = new Map();
  }

  initializeDefaultRooms() {
    const defaultRooms = ['general', 'random', 'tech'];
    defaultRooms.forEach(roomName => {
      this.rooms.set(roomName, {
        name: roomName,
        users: new Set(),
        createdAt: new Date()
      });
      this.messages.set(roomName, []);
    });
    console.log('Default rooms initialized:', Array.from(this.rooms.keys()));
  }

  addUser(socketId, userData) {
    this.users.set(socketId, {
      id: socketId,
      ...userData,
      joinedAt: new Date()
    });
  }

  removeUser(socketId) {
    const user = this.users.get(socketId);
    if (user) {
      // Remove user from all rooms
      this.rooms.forEach(room => {
        room.users.delete(socketId);
      });
    }
    this.users.delete(socketId);
    return user;
  }

  getUser(socketId) {
    return this.users.get(socketId);
  }

  getAllUsers() {
    return Array.from(this.users.values());
  }

  joinRoom(socketId, roomName) {
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, {
        name: roomName,
        users: new Set(),
        createdAt: new Date()
      });
      this.messages.set(roomName, []);
    }
    
    const room = this.rooms.get(roomName);
    room.users.add(socketId);
    return room;
  }

  leaveRoom(socketId, roomName) {
    const room = this.rooms.get(roomName);
    if (room) {
      room.users.delete(socketId);
    }
  }

  getRoomUsers(roomName) {
    const room = this.rooms.get(roomName);
    if (!room) return [];
    
    return Array.from(room.users).map(socketId => this.users.get(socketId)).filter(Boolean);
  }

  addMessage(roomName, message) {
    if (!this.messages.has(roomName)) {
      this.messages.set(roomName, []);
    }
    
    const messageData = {
      id: Date.now() + Math.random(),
      ...message,
      timestamp: new Date()
    };
    
    this.messages.get(roomName).push(messageData);
    return messageData;
  }

  getRoomMessages(roomName) {
    return this.messages.get(roomName) || [];
  }
}

module.exports = new InMemoryStore();