import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { io, getReceiverSocketId } from "../socket.js";

// Send a message


// POST /api/message/send/:recieverId
export const sendMessage = async (req, res) => {
  try {
    const me = req.user?.id;               
    const other = req.params?.recieverId;  

    console.log("[SEND]", { me, other });

    if (!me) return res.status(401).json({ message: "Not authenticated" });
    if (!other) return res.status(400).json({ message: "recieverId (param) is required" });

    const doc = await Message.create({
        sender: me,                
        reciever: other,            
        message: req.body.message || "",
      });

    let conversation = await Conversation.findOne({
      paticipants: { $all: [me, other] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        paticipants: [me, other],
        messages: [doc._id]
      });
      console.log("[CONVERSATION] Created new conversation:", conversation._id);
    } else {
      conversation.messages.push(doc._id);
      await conversation.save();
      console.log("[CONVERSATION] Updated existing conversation:", conversation._id);
    }

    const messageData = {
      _id: String(doc._id),
      sender: String(doc.sender),
      receiver: String(doc.reciever),
      message: doc.message || "",
      createdAt: doc.createdAt,
    };

    const receiverSocketId = getReceiverSocketId(other);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageData);
      console.log(`[SOCKET] Message sent to ${other} via socket ${receiverSocketId}`);
    }

    return res.status(201).json(messageData);
  } catch (err) {
    console.error("[SEND ERROR]", err);
    return res.status(500).json({ message: "Failed to send message" });
  }
};

// GET /api/message/getAll/:recieverId
export const getAllMessages = async (req, res) => {
  try {
    const me = req.user?.id;               
    const other = req.params?.recieverId;   

    console.log("[GET ALL]", { me, other, params: req.params });

    if (!me) return res.status(401).json({ message: "Not authenticated" });
    if (!other) return res.status(400).json({ message: "recieverId (param) is required" });

    const docs = await Message.find({
      $or: [
        { sender: me, reciever: other },
        { sender: other, reciever: me },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    // Map DB fields to a clean API response (sender, receiver as strings)
    const msgs = docs.map((m) => ({
      _id: String(m._id),
      sender: String(m.sender),
      receiver: String(m.reciever), 
      message: m.message || "",
      createdAt: m.createdAt,
    }));

    console.log("[GET ALL] count:", msgs.length);
    return res.json(msgs);
  } catch (err) {
    console.error("[GET ALL ERROR]", err);
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
};
export const getPreviousUserChats = async (req, res) => {
    try {
        const currentUserId = req.user?.id;

        if (!currentUserId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const conversations = await Conversation.find({
            paticipants: currentUserId
        })
            .populate("paticipants", "-password")
            .sort({ updatedAt: -1 });

        console.log("[PREVIOUS CHATS] Found conversations:", conversations.length);

        const userMap = {};
        conversations.forEach(conv => {
            conv.paticipants.forEach(user => {
                if (user._id.toString() !== currentUserId.toString()) {
                    userMap[user._id] = user;
                }
            });
        });

        const previousUsers = Object.values(userMap);
        console.log("[PREVIOUS CHATS] Returning users:", previousUsers.length, previousUsers.map(u => ({ id: u._id, name: u.name, username: u.username })));

        return res.status(200).json(previousUsers);
    } catch (error) {
        console.error("Previous User fetch error:", error);
        return res.status(400).json({ message: "Previous User fetch error", error });
    }
};

