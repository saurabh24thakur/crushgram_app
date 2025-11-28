// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

import userReducer from "./userSlice.js";
import messageReducer from "./messageSlice.js";
import socketReducer from "./socketSlice.js";
import notificationReducer from "./notificationSlice.js";

// Persist configuration for message slice
const messagePersistConfig = {
  key: "message",
  storage,
  whitelist: ["selectedUser", "conversations"], // Only persist these fields
};

// Persist configuration for notification slice
const notificationPersistConfig = {
  key: "notification",
  storage,
  whitelist: ["notifications", "unreadCount"],
};

const persistedMessageReducer = persistReducer(messagePersistConfig, messageReducer);
const persistedNotificationReducer = persistReducer(notificationPersistConfig, notificationReducer);

const store = configureStore({
  reducer: {
    user: userReducer,
    message: persistedMessageReducer, // Use persisted version
    socket: socketReducer,
    notification: persistedNotificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions and socket-related paths
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "socket/setSocket"],
        ignoredPaths: ["socket.socket", "register", "rehydrate"],
      },
    }),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);
export default store;