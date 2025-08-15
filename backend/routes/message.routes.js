import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { getAllMessages, getPreviousUserChats, sendMessage } from "../controllers/message.controller.js";



const messageRouter= express.Router();
 
messageRouter.post("/send/:recieverId",isAuth,upload.single("image"),sendMessage)
messageRouter.get("/getAll/:recieverId",isAuth,getAllMessages)
messageRouter.get("/previouschats",isAuth,getPreviousUserChats)

export default messageRouter;

