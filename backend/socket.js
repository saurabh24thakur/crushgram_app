import http from "http";
import express from "express";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { redisClient, connectRedis, isRedisConnected } from "./config/redis.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://api.procoder.dpdns.org",
      "https://www.procoder.dpdns.org",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Fallback in-memory store
const userSocketMap = {}; 

// Initialize Redis or Fallback
(async () => {
    await connectRedis();
    
    if (isRedisConnected) {
        const pubClient = redisClient.duplicate();
        const subClient = redisClient.duplicate();
        
        Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
            io.adapter(createAdapter(pubClient, subClient));
            console.log("Redis Adapter connected");
        }).catch(err => {
            console.log("Failed to connect Redis Adapter pub/sub clients", err);
        });
    }
})();

io.on("connection", async (socket) => {
  const userId = socket.handshake?.auth?.userId;

  if (userId) {
    if (isRedisConnected) {
        await redisClient.hSet("online_users", userId, socket.id);
    } else {
        userSocketMap[userId] = socket.id;
    }
    console.log(`[SOCKET] User connected: ${userId} -> ${socket.id} (Redis: ${isRedisConnected})`);
  }

  // Broadcast online users
  let onlineUsers = [];
  if (isRedisConnected) {
      onlineUsers = await redisClient.hKeys("online_users");
  } else {
      onlineUsers = Object.keys(userSocketMap);
  }
  io.emit("getOnlineUsers", onlineUsers);

  socket.on("disconnect", async () => {
    if (userId) {
        if (isRedisConnected) {
            const currentSocketId = await redisClient.hGet("online_users", userId);
            if (currentSocketId === socket.id) {
                await redisClient.hDel("online_users", userId);
                console.log(`[SOCKET] User disconnected: ${userId}`);
            }
        } else {
            if (userSocketMap[userId] === socket.id) {
                delete userSocketMap[userId];
                console.log(`[SOCKET] User disconnected: ${userId}`);
            }
        }
    }
    
    let updatedOnlineUsers = [];
    if (isRedisConnected) {
        updatedOnlineUsers = await redisClient.hKeys("online_users");
    } else {
        updatedOnlineUsers = Object.keys(userSocketMap);
    }
    io.emit("getOnlineUsers", updatedOnlineUsers);
  });
});

// Helper function to get receiver's socket ID
export const getReceiverSocketId = async (receiverId) => {
    if (isRedisConnected) {
        return await redisClient.hGet("online_users", receiverId);
    } else {
        return userSocketMap[receiverId];
    }
};

export { io, server, app };