import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlinePaperClip } from "react-icons/ai";
import { serverURL } from "../../config.js";
import { setMessages } from "../../redux/messageSlice";
import axios from "axios";
import SenderMessage from "../../component/MesasageComponent/SenderMessage";
import RecieverMessage from "../../component/MesasageComponent/RecieverMessage";

function ChatDraft() {
  
  
  const { selectedUser, messages } = useSelector((state) => state.message);
  const { userData } = useSelector((state) => state.user);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedUser?._id || !input.trim()) return;

    try {
      const formData = new FormData();
  formData.append("message",input);
      const res = await axios.post(
        `${serverURL}/api/message/send/${selectedUser._id}`,
        { message: input },
        { withCredentials: true }
      );
      dispatch(setMessages([...(messages || []), res.data]));
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

  useEffect(() => {
    getAllMessages();
  }, [selectedUser]);

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
          const receiverId = String(m?.receiver || "");

          // Tiny per-message log
          console.log(`[MSG ${i}]`, { senderId, receiverId, myId });

          const isMine = senderId === myId;

          // RecieverMessage = your/right bubble, SenderMessage = other/left
          return isMine ? (
            <SenderMessage key={m?._id || i} message={m} />
            
          ) : (
            <RecieverMessage key={m?._id || i} message={m} />
          );
        })}
      </div>

      <div className="flex items-center gap-2 p-4  bg-white">
        <input
          type="text"
          placeholder="Write a message..."
          className="flex-1 p-2 border rounded-lg outline-none"
          onChange={(e) => setInput(e.target.value)}
          value={input}
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
