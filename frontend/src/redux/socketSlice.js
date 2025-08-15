// src/redux/socketSlice.js
import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    connected: false,
    onlineUsers: [],
  },
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload || [];
    },
    resetSocketState: (state) => {
      state.connected = false;
      state.onlineUsers = [];
    },
  },
});

export const { setConnected, setOnlineUsers, resetSocketState } = socketSlice.actions;
export default socketSlice.reducer;