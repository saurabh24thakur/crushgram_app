import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  editProfile,
  followUser,
  getCurrentUser,
  getProfile,
  getUserFollowers,
  getUserFollowing,
  getUserSocial,
  searchUsersByUsername,
  unfollowUser,
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.js";
import User from "../models/user.model.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.post(
  "/editprofile",
  isAuth,
  upload.single("profileImage"),
  editProfile
);
userRouter.get("/getprofile/:username", getProfile);
userRouter.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ message: "Missing search query" });

  try {
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("username name profileImage");

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

userRouter.post("/:id/follow", isAuth, followUser);
userRouter.post("/:id/unfollow", isAuth, unfollowUser);


userRouter.get("/:userName/followers", getUserFollowers);
userRouter.get("/:userName/following", getUserFollowing);

userRouter.get("/:userName/social", getUserSocial);

export default userRouter;
