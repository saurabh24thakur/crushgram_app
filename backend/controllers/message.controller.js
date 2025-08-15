import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

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

    // Return minimal consistent shape (map 'reciever' -> 'receiver')
    return res.status(201).json({
      _id: String(doc._id),
      sender: String(doc.sender),
      receiver: String(doc.reciever),
      message: doc.message || "",
      createdAt: doc.createdAt,
    });
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
// Get previous chat users
export const getPreviousUserChats = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const conversations = await Conversation.find({
            participants: currentUserId
        })
            .populate("participants", "-password")
            .sort({ updatedAt: -1 });

        const userMap = {};
        conversations.forEach(conv => {
            conv.participants.forEach(user => {
                if (user._id.toString() !== currentUserId.toString()) {
                    userMap[user._id] = user;
                }
            });
        });

        const previousUsers = Object.values(userMap);

        return res.status(200).json(previousUsers);
    } catch (error) {
        console.error("Previous User fetch error:", error);
        return res.status(400).json({ message: "Previous User fetch error", error });
    }
};
