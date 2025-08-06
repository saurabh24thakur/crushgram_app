import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import {  getAllPost, savedPost, uploadPost } from "../controllers/post.controller.js";
import { getAllVibez, like, uploadVibez , comment} from "../controllers/vibez.controller.js";


const vibezRouter= express.Router();

vibezRouter.post("/upload",isAuth,upload.single("media"),uploadVibez)
vibezRouter.get("/getAll",isAuth,getAllVibez)
vibezRouter.get("/like/:postId",isAuth,like)
vibezRouter.post("/comment",isAuth,comment)
vibezRouter.get("/saved/:postId",isAuth,savedPost)
export default vibezRouter;

