// src/App.jsx
import React, { useEffect, useCallback } from "react";
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
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";
import ProfileEdit from "./pages/profileEdit/ProfileEdit.jsx";
import UserProfile from "./pages/userProfile/UserProfile";
import Story from "./pages/Story/Story";
import Story_creation from "./pages/Story/Story_creation";
import Vibez_creation from "./pages/vibez/Vibez_creation";
import Vibez from "./pages/vibez/Vibez";
import CreatePost from "./component/Post/CreatePost";
import ChatDraft from "./pages/MessageBox/ChatDraft";

// Redux
import { setOnlineUsers } from "./redux/socketSlice.js";
import { addNotification } from "./redux/notificationSlice.js";

// Socket
import { getSocket, disconnectSocket } from "./client.js";

function App() {
  const { userData } = useSelector((state) => state.user);
  const { loading } = useCurrentUser();
  const dispatch = useDispatch();

  // ---------------- Socket Effect ----------------

  const handleOnlineUsers = useCallback((users) => {
    dispatch(setOnlineUsers(users || []));
  }, [dispatch]);

  const handleNewFollower = useCallback((followerData) => {
    dispatch(addNotification(followerData));
    console.log("[NOTIFICATION] New follower:", followerData);
  }, [dispatch]);


  useEffect(() => {
    if (!userData?._id) {
      disconnectSocket();
      dispatch(setOnlineUsers([]));
      return;
    }

    const socket = getSocket();

    if (!socket.connected) {
      socket.auth = { userId: userData._id };
      socket.connect();
    }

    socket.off("getOnlineUsers", handleOnlineUsers);
    socket.on("getOnlineUsers", handleOnlineUsers);

    socket.off("newFollower", handleNewFollower);
    socket.on("newFollower", handleNewFollower);

    return () => {
      socket.off("getOnlineUsers", handleOnlineUsers);
      socket.off("newFollower", handleNewFollower);
    };
  }, [userData?._id, dispatch, handleOnlineUsers, handleNewFollower]);


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