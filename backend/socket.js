import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {}; // userId -> socketId

io.on("connection", (socket) => {
  // Use auth.userId (matching frontend socket.auth = { userId })
  const userId = socket.handshake?.auth?.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`[SOCKET] User connected: ${userId} -> ${socket.id}`);
  }

  // broadcast current online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    // only delete if this socket is the one we stored
    if (userId && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
      console.log(`[SOCKET] User disconnected: ${userId}`);
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Helper function to get receiver's socket ID
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export { io, server, app, userSocketMap };