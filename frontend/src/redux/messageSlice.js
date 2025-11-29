import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message", // Fixed: was incorrectly named "user"
  initialState: {
    selectedUser: null,
    messages: [],
    conversations: [], // Track recent conversations with metadata
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload; 
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    addOrUpdateConversation: (state, action) => {
      const { userId, username, profilePic, lastMessage, timestamp } = action.payload;
      const existingIndex = state.conversations.findIndex(c => c.userId === userId);
      
      const conversation = {
        userId,
        username,
        profilePic,
        lastMessage,
        timestamp,
      };

      if (existingIndex >= 0) {
        // Update existing conversation and move to top
        state.conversations.splice(existingIndex, 1);
        state.conversations.unshift(conversation);
      } else {
        // Add new conversation at top
        state.conversations.unshift(conversation);
      }
    },
  },
});

export const { setSelectedUser, setMessages, setConversations, addOrUpdateConversation } = messageSlice.actions;
export default messageSlice.reducer;
