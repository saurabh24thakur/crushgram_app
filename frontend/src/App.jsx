import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Layout + Pages
import Layout from "./component/Layout";
import { Home } from "./component/home/Home";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import Search from "./component/Search/Search";
import MessageBox from "./pages/MessageBox/MessageBox";
import Followers from "./pages/Followers/Followers";
import Notification from "./pages/Notifications/Noticfication";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ForgotPassword from "./pages/ForgotPassword/ForgotPAssword";

// Custom Hook
import GetCurrentUser from "./hooks/getCurrentUSer";
import ProfileEdit from "./pages/profileEdit/profileEdit";
import UserProfile from "./pages/userProfile/UserProfile";
import Story from "./pages/Story/Story";
import Story_creation from "./pages/Story/Story_creation";
import Vibez_creation from "./pages/vibez/Vibez_creation";
import Vibez from "./pages/vibez/Vibez";
import CreatePost from "./component/Post/CreatePost";

// Backend base URL
export const serverURL = "http://localhost:3002";

function App() {
  const { userData } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <GetCurrentUser />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={userData ? <Home /> : <Navigate to="/signup" />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/:userName" element={<UserProfile />} />

          <Route path="search" element={<Search />} />
          <Route path="message" element={<MessageBox />} />
          <Route path="follower" element={<Followers data={{ title: "Followers.." }} />} />
          <Route path="following" element={<Followers data={{ title: "Following.." }} />} />
          <Route path="notification" element={<Notification />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="editprofile" element={<ProfileEdit />} />
          <Route path="story" element={<Story />} />
          <Route path="story/upload" element={<Story_creation/>} />
          <Route path="vibez/upload" element={<Vibez_creation/>} />
          <Route path="post/upload" element={<CreatePost/>} />
          <Route path="vibez" element={<Vibez/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
