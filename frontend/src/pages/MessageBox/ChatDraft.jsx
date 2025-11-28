import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlinePaperClip } from "react-icons/ai";
import { serverURL } from "../../config.js";
import { setMessages, addOrUpdateConversation } from "../../redux/messageSlice";
import { getSocket } from "../../client.js";
import axios from "axios";
import SenderMessage from "../../component/MesasageComponent/SenderMessage";
import RecieverMessage from "../../component/MesasageComponent/RecieverMessage";

function ChatDraft() {
  const { selectedUser, messages } = useSelector((state) => state.message);
  const { userData } = useSelector((state) => state.user);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Redirect to /message if no user is selected
  useEffect(() => {
    if (!selectedUser) {
      navigate("/message");
    }
  }, [selectedUser, navigate]);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedUser?._id || !input.trim()) return;

    try {
      const res = await axios.post(
        `${serverURL}/api/message/send/${selectedUser._id}`,
        { message: input },
        { withCredentials: true }
      );
      
      // Update messages locally
      dispatch(setMessages([...(messages || []), res.data]));
      
      // Update conversation metadata
      dispatch(addOrUpdateConversation({
        userId: selectedUser._id,
        username: selectedUser.username,
        profilePic: selectedUser.profilePic,
        lastMessage: input,
        timestamp: new Date().toISOString(),
      }));
      
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const getAllMessages = async () => {
    try {
      if (!selectedUser?._id) return;
      const res = await axios.get(
        `${serverURL}/api/message/getAll/${selectedUser._id}`,
        { withCredentials: true }
      );
      dispatch(setMessages(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch messages when selectedUser changes
  useEffect(() => {
    getAllMessages();
  }, [selectedUser]);

  // Real-time message listener
  useEffect(() => {
    const socket = getSocket();

    const handleNewMessage = (message) => {
      console.log("[REAL-TIME] New message received:", message);
      
      // Only add message if it's from the current conversation
      if (message.sender === selectedUser?._id || message.receiver === selectedUser?._id) {
        dispatch(setMessages([...(messages || []), message]));
        
        // Update conversation metadata
        dispatch(addOrUpdateConversation({
          userId: message.sender === userData?._id ? message.receiver : message.sender,
          username: selectedUser.username,
          profilePic: selectedUser.profilePic,
          lastMessage: message.message,
          timestamp: message.createdAt,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    // Cleanup listener on unmount
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedUser, messages, dispatch, userData]);

  if (!selectedUser) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex flex-col h-screen bg-[#f6e3e3]">
      <div className="flex bg-white items-center gap-3 p-4 ">
        <img
          src={selectedUser?.profilePic || "https://via.placeholder.com/40"}
          alt={selectedUser?.username || "User"}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="font-semibold text-lg">
            {selectedUser?.username || "Select a user"}
          </h2>
          <p className="text-sm text-gray-500">Active now</p>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages?.map((m, i) => {
          const myId = String(userData?._id || "");
          const senderId = String(m?.sender || "");

          const isMine = senderId === myId;

          return isMine ? (
            <SenderMessage key={m?._id || i} message={m} />
          ) : (
            <RecieverMessage key={m?._id || i} message={m} />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center gap-2 p-4  bg-white">
        <input
          type="text"
          placeholder="Write a message..."
          className="flex-1 p-2 border rounded-lg outline-none"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage(e)}
        />
        <AiOutlinePaperClip
          className="text-gray-500 cursor-pointer"
          size={20}
        />
        {input && (
          <button
            className="bg-blue-100 px-4 py-2 rounded-lg font-medium"
            onClick={handleSendMessage}
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
}

export default ChatDraft;

