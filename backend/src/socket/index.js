import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import { socketMiddleware } from '../middlewares/socketMiddleware.js';
import { getUserConversationForSocketIO } from '../controllers/conversationController.js';
import { setIO } from '../libs/socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Set io instance globally
setIO(io);

io.use(socketMiddleware);

const onlineUsers = new Map(); // { userId: socketId }

io.on('connection', async (socket) => {
  const user = socket.user;
  console.log(`${user.displayName} online với socket id: ${socket.id}`);

  onlineUsers.set(user._id, socket.id);

  io.emit('online-Users', Array.from(onlineUsers.keys()));

  const conversationIds = await getUserConversationForSocketIO(user._id);
  conversationIds.forEach((id) => {
    socket.join(id);
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(user._id);
    io.emit('online-Users', Array.from(onlineUsers.keys()));
    console.log(`${user.displayName} offline với socket id: ${socket.id}`);
  });
});

export { io, app, server };
