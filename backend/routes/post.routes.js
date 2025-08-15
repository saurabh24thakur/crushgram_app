import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import {
  comment,
  getAllPost,
  savedPost,
  uploadPost,
  like,
  getFollowingPosts,
  getComments
} from "../controllers/post.controller.js";

const postRouter = express.Router();

// Upload post
postRouter.post("/upload", isAuth, upload.single("media"), uploadPost);

// Get all posts
postRouter.get("/getAll", isAuth, getAllPost);

// Like / Unlike
postRouter.patch("/like/:postId", isAuth, like);

// Comment on post
postRouter.post("/comment/:postId", isAuth, comment);
postRouter.get("/comment/:postId", isAuth, getComments);

// Save / Unsave post
postRouter.patch("/save/:postId", isAuth, savedPost);

// Feed from following users
postRouter.get("/feed", isAuth, getFollowingPosts);

export default postRouter;
