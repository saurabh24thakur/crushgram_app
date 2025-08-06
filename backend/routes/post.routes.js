import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { comment, getAllPost, savedPost, uploadPost , like} from "../controllers/post.controller.js";


const postRouter= express.Router();

postRouter.post("/upload",isAuth,upload.single("media"),uploadPost)
postRouter.get("/getAll",isAuth,getAllPost)
postRouter.get("/like/:postId",isAuth,like)
postRouter.post("/comment",isAuth,comment)
export default postRouter;

