const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const socketConfig = require('./config/socketConfig');
const store = require('./models/inMemoryStore');
const socketHandlers = require('./socket/socketHandlers');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: socketConfig.corsOptions
});

// Initialize data stores
store.initializeDefaultRooms();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Socket.IO handlers
socketHandlers(io, store);

// API endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/api/stats', (req, res) => {
  const { users, rooms, messages } = store;
  res.json({
    connectedUsers: users.size,
    totalRooms: rooms.size,
    totalMessages: Array.from(messages.values()).reduce((sum, msgs) => sum + msgs.length, 0)
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});