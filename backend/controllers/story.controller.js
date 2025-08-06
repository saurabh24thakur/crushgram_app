import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import Story from "../models/story.model.js";

export const uploadStory = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.story) {
      await Story.findByIdAndDelete(user.story);
      user.story = null;
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a media file for story" });
    }

    const media = await uploadOnCloudinary(req.file.path);
    const { mediaType } = req.body;

    const story = await Story.create({
      author: req.userId,
      mediaType,
      media: media.secure_url, // ✅ Only send string
    });

    user.story = story._id;
    await user.save();

    const populatedStory = await Story.findById(story._id)
      .populate("author", "name username profileImage")
      .populate("viewers", "name username profileImage");

    return res.status(200).json(populatedStory);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const viewStory = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(400).json({ message: "Story not found" });
    }

    const alreadyViewed = story.viewers.some(
      (id) => id.toString() === req.userId.toString()
    );

    if (!alreadyViewed) {
      story.viewers.push(req.userId);
      await story.save();
    }

    const populatedStory = await Story.findById(story._id)
      .populate("author", "name username profileImage")
      .populate("viewers", "name username profileImage");

    return res.status(200).json(populatedStory);
  } catch (error) {
    return res.status(500).json({ message: "Story view error", error: error.message });
  }
};

export const getStoryByUsername = async (req, res) => {
  try {
    const userName = req.params.userName;
    const user = await User.findOne({ username: userName });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const story = await Story.findOne({ author: user._id })
      .populate("author", "name username profileImage")
      .populate("viewers", "name username profileImage");

    if (!story) {
      return res.status(404).json({ message: "No story found for user" });
    }

    return res.status(200).json(story);
  } catch (error) {
    return res.status(500).json({ message: "Get story by username error", error: error.message });
  }
};


export const getFollowerStories = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId).populate("following");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const followedUserIds = currentUser.following.map((user) => user._id);

    const stories = await Story.find({ author: { $in: followedUserIds } })
      .sort({ createdAt: -1 }) // optional: latest first
      .populate("author", "name username profileImage")
      .populate("viewers", "name username profileImage");

    return res.status(200).json(stories);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch follower stories",
      error: error.message,
    });
  }
};
