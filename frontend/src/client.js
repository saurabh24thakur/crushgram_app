// src/client.js
import { io } from "socket.io-client";
import { serverURL } from "./config.js";

let socket; // singleton

export function getSocket() {
  if (!socket) {
    socket = io(serverURL, {
      withCredentials: true,
      autoConnect: false,
      transports: ["websocket"],
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
