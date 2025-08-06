import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { getStoryByUsername, uploadStory,viewStory } from "../controllers/story.controller.js";
import { getFollowerStories } from "../controllers/story.controller.js";


const storyRouter= express.Router();

storyRouter.post("/upload",isAuth,upload.single("media"),uploadStory)
storyRouter.get("/getbyusername/:username",isAuth,getStoryByUsername)

storyRouter.get("/view/:storyId",isAuth,viewStory)


storyRouter.get("/follower-stories", isAuth, getFollowerStories);


export default storyRouter;

