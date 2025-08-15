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
  const userId = socket.handshake?.query?.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // broadcast current online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // <- emit

  socket.on("disconnect", () => {
    // only delete if this socket is the one we stored
    if (userId && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // <- emit
  });
});

export { io, server, app };