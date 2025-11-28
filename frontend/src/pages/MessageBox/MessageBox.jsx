import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedUser } from "../../redux/messageSlice";
import { serverURL } from "../../config.js";
import axios from "axios";

import vector0 from "../../assets/pic1.jpg";

function MessageBox() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [previousChats, setPreviousChats] = useState([]);

  const { userData } = useSelector(state => state.user);
  const { conversations } = useSelector(state => state.message);

  if (!userData) return <div>Loading...</div>;

  useEffect(() => {
    const fetchPreviousChats = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${serverURL}/api/message/previouschats`, {
          withCredentials: true,
        });
        console.log("[FRONTEND] API Response:", res.data);
        console.log("[FRONTEND] First user:", res.data[0]);
        setPreviousChats(res.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching previous chats:", err);
        setLoading(false);
      }
    };

    fetchPreviousChats();
  }, []);

  const handleMessageClick = (clickedUser) => {
    if (!clickedUser || clickedUser?._id === userData?._id) return;

    const target = {
      _id: clickedUser._id,
      username: clickedUser.username,
      profilePic: clickedUser.profileImage || clickedUser.profilePic || "",
    };

    dispatch(setSelectedUser(target));
    navigate(`/message/${target.username}`);
  };

  const getDisplayList = () => {
    const conversationMap = new Map();
    
    previousChats.forEach(user => {
      conversationMap.set(user._id, {
        _id: user._id,
        username: user.username,
        name: user.name,
        profileImage: user.profileImage,
      });
    });

    conversations.forEach(conv => {
      const existing = conversationMap.get(conv.userId);
      conversationMap.set(conv.userId, {
        _id: conv.userId,
        username: conv.username || existing?.username,
        name: existing?.name || conv.username,
        profileImage: conv.profilePic || existing?.profileImage,
        lastMessage: conv.lastMessage,
        timestamp: conv.timestamp,
      });
    });

    return Array.from(conversationMap.values());
  };

  const displayList = getDisplayList();
  
  console.log("[FRONTEND] Display List:", displayList);
  console.log("[FRONTEND] First display item:", displayList[0]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col min-h-[800px] items-start relative bg-[#f6e3e3]">
      <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
        <div className="items-start justify-center px-4 sm:px-8 md:px-20 lg:px-40 py-5 flex-1 grow flex relative self-stretch w-full">
          <div className="flex flex-col max-w-[960px] items-start relative flex-1 grow gap-3">
            <div className="flex flex-wrap items-start justify-around gap-[12px_12px] p-4 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col w-72 items-start relative">
                <div className="relative self-stretch mt-[-1.00px] font-bold text-[#111416] text-[32px] leading-10">
                  Messages
                </div>
              </div>
            </div>

            {loading ? (
              <div className="px-4 py-2 text-[#607589]">Loading conversations...</div>
            ) : displayList.length > 0 ? (
              displayList.map((user) => (
                <div
                  key={user._id}
                  className="flex min-h-[72px] items-center gap-4 px-4 py-2 w-full bg-white cursor-pointer hover:bg-gray-100 transition border-b-2"
                  onClick={() => handleMessageClick(user)}
                >
                  <img
                    src={user.profileImage || vector0}
                    alt={user.name || user.username}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="flex flex-col items-start justify-center flex-1">
                    <p className="font-medium text-[#111416] text-base leading-6">
                      {user.name || user.username}
                    </p>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm text-[#607589] leading-[21px] truncate max-w-[200px]">
                        {user.lastMessage || `@${user.username}`}
                      </span>
                      {user.timestamp && (
                        <span className="text-xs text-[#9ca3af] ml-2">
                          {formatTime(user.timestamp)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : userData?.follower && userData.follower.length > 0 ? (
              <React.Fragment key="followers-list">
                <div className="px-4 py-2 text-[#607589] text-sm">
                  No recent conversations. Start chatting with your followers:
                </div>
                {userData.follower.map((user) => (
                  <div
                    key={user._id}
                    className="flex min-h-[72px] items-center gap-4 px-4 py-2 w-full bg-white cursor-pointer hover:bg-gray-100 transition border-b-2"
                    onClick={() => handleMessageClick(user)}
                  >
                    <img
                      src={user.profileImage || vector0}
                      alt={user.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="flex flex-col items-start justify-center">
                      <p className="font-medium text-[#111416] text-base leading-6">
                        {user.name}
                      </p>
                      <span className="text-sm text-[#607589] leading-[21px]">
                        @{user.username}
                      </span>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ) : (
              <div className="px-4 py-2 text-[#607589]">No conversations yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBox;