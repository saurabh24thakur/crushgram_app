// src/App.jsx
import React, { useEffect, useCallback } from "react"; // <-- 1. Import useCallback
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Layout + Pages
import Layout from "./component/Layout";
import Home from "./component/home/Home.jsx";
import useCurrentUser from "./hooks/useCurrentUser.js";

import ProfilePage from "./pages/ProfilePage/ProfilePage";
import Search from "./component/Search/Search";
import MessageBox from "./pages/MessageBox/MessageBox";
import Followers from "./pages/Followers/Followers";
import Notification from "./pages/Notifications/Noticfication";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ForgotPassword from "./pages/ForgotPassword/ForgotPAssword";
import ProfileEdit from "./pages/profileEdit/profileEdit";
import UserProfile from "./pages/userProfile/UserProfile";
import Story from "./pages/Story/Story";
import Story_creation from "./pages/Story/Story_creation";
import Vibez_creation from "./pages/vibez/Vibez_creation";
import Vibez from "./pages/vibez/Vibez";
import CreatePost from "./component/Post/CreatePost";
import ChatDraft from "./pages/MessageBox/ChatDraft";

// Redux
import { setOnlineUsers } from "./redux/socketSlice.js";

// Socket
import { getSocket, disconnectSocket } from "./client.js";

function App() {
  const { userData } = useSelector((state) => state.user);
  const { loading } = useCurrentUser();
  const dispatch = useDispatch();

  // ---------------- Socket Effect (FIXED) ----------------

  // 2. Wrap the event handler in useCallback. This gives the function a stable
  // identity across re-renders, preventing the useEffect from re-running unnecessarily.
  const handleOnlineUsers = useCallback((users) => {
    dispatch(setOnlineUsers(users || []));
  }, [dispatch]);


  useEffect(() => {
    // If there is no user, disconnect any existing socket and clear online users.
    if (!userData?._id) {
      disconnectSocket();
      dispatch(setOnlineUsers([]));
      return;
    }

    // Get the single socket instance from your client.js
    const socket = getSocket();

    // Configure and connect the socket ONLY if it's not already connected.
    if (!socket.connected) {
      socket.auth = { userId: userData._id };
      socket.connect();
    }

    // 3. The CORE FIX: Always remove the listener before adding it.
    // This is an idempotent pattern, meaning it's safe to run multiple times
    // and will guarantee that only ONE listener for this event is active.
    socket.off("getOnlineUsers", handleOnlineUsers); // <-- Remove previous listener
    socket.on("getOnlineUsers", handleOnlineUsers);  // <-- Add the new one

    // The cleanup function runs when the component unmounts or when a dependency changes.
    return () => {
      // It's still good practice to clean up the listener on unmount/logout.
      socket.off("getOnlineUsers", handleOnlineUsers);
    };
    // 4. Add `handleOnlineUsers` to the dependency array.
  }, [userData?._id, dispatch, handleOnlineUsers]);


  // ---------------- Loading State ----------------
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={userData ? <Home /> : <Navigate to="/signup" />} />

          {/* Profile & Followers */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/followers" element={<Followers type="follower" title="Followers" isCurrentUser={true} />} />
          <Route path="profile/following" element={<Followers type="following" title="Following" isCurrentUser={true} />} />
          <Route path="profile/:userName" element={<UserProfile />} />
          <Route path="profile/:userName/followers" element={<Followers type="follower" title="Followers" isCurrentUser={false} />} />
          <Route path="profile/:userName/following" element={<Followers type="following" title="Following" isCurrentUser={false} />} />
          <Route path="follower" element={<Navigate to="/profile/followers" replace />} />
          <Route path="following" element={<Navigate to="/profile/following" replace />} />

          {/* Other Pages */}
          <Route path="search" element={<Search />} />
          <Route path="message" element={<MessageBox />} />
          <Route path="message/:userName" element={<ChatDraft />} />
          <Route path="notification" element={<Notification />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="editprofile" element={<ProfileEdit />} />
          <Route path="story" element={<Story />} />
          <Route path="story/upload" element={<Story_creation />} />
          <Route path="vibez" element={<Vibez />} />
          <Route path="vibez/upload" element={<Vibez_creation />} />
          <Route path="post/upload" element={<CreatePost />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;