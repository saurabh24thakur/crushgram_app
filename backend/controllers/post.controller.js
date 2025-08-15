import uploadOnCloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import path from "path";
import fs from "fs";


// Upload post controller

export const uploadPost = async (req, res) => {
  try {
    const { caption, tagged, audience, mediaType } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Media file is required." });
    }

    const filePath = path.resolve(req.file.path);

    if (!fs.existsSync(filePath)) {
      console.error("File not found on disk:", filePath);
      return res.status(500).json({ message: "File not found on disk." });
    }

    const cloudinaryRes = await uploadOnCloudinary(filePath);

    if (!cloudinaryRes || !cloudinaryRes.secure_url) {
      console.error("Cloudinary upload failed:", cloudinaryRes);
      return res.status(500).json({ message: "Cloudinary upload failed." });
    }

    const taggedValue = tagged || "any";
    const audienceValue = audience || "any";
    
    const newPost = await Post.create({
      caption,
      tagged: taggedValue,
      audience: audienceValue,
      mediaType,
      media: cloudinaryRes.secure_url,
      author: req.user.id,
    });
    await User.findByIdAndUpdate(req.user.id, {
      $push: { posts: newPost._id },
    });

    return res.status(201).json({ message: "Post uploaded", post: newPost });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find({}).populate(
      "author",
      "name username profileImage"
    );
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Error at post retriving", error });
  }
};

// likes controller

// likes controller
export const like = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user?.id || req.userId; // consistent user id

    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ message: "Post not found" });

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();
    await post.populate("author", "name username profileImage");

    return res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
      liked: !alreadyLiked,
      postId: post._id,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error during like post", error });
  }
};

// comment controller
export const comment = async (req, res) => {
  try {
    const userId = req.user?.id;                 // from your isAuth
    const postId = req.params?.postId;
    const message = (req.body?.message || "").trim();

    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ message: "Invalid postId" });
    }
    if (!message) return res.status(400).json({ message: "Message is required" });

    const updated = await Post.findByIdAndUpdate(
      postId,
      { $push: { comment: { author: userId, message, createdAt: new Date() } } }, // note: comment + author
      { new: true, select: "_id comment" }
    );

    if (!updated) return res.status(404).json({ message: "Post not found" });

    return res.status(201).json({
      message: "Comment added",
      commentsCount: updated.comment?.length || 0, // singular 'comment' in schema
      postId,
    });
  } catch (err) {
    console.error("[COMMENT_ERROR]", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getComments = async (req, res) => {
  try {
    const postId = req.params?.postId;
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ message: "Invalid postId" });
    }

    const post = await Post.findById(postId)
      .select("comment")
      .populate("comment.author", "username profileImage");

    if (!post) return res.status(404).json({ message: "Post not found" });

    return res.json({
      comments: post.comment,               // array of { _id, author, message, createdAt }
      commentsCount: post.comment.length,
    });
  } catch (err) {
    console.error("[GET_COMMENTS_ERROR]", err);
    return res.status(500).json({ message: "Server error" });
  }
};
// saved post controller
export const savedPost = async (req, res) => {
  try {
    const userId = req.user?.id;            
    const postId = req.params.postId;

    // tiny logs
    console.log("[SAVE_POST] user:", userId, "post:", postId);

    // guards
    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid postId" });
    }

    // check post exists (cheap exists instead of full find)
    const postExists = await Post.exists({ _id: postId });
    if (!postExists) return res.status(404).json({ message: "Post not found" });

    // check if already saved
    const alreadySaved = await User.exists({ _id: userId, saved: postId });

    // toggle atomically
    const update = alreadySaved
      ? { $pull: { saved: postId } }
      : { $addToSet: { saved: postId } };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      update,
      { new: true, select: "_id saved" }
    );

    const savedCount = updatedUser?.saved?.length || 0;

    console.log("[SAVE_POST:OK]", {
      action: alreadySaved ? "unsave" : "save",
      savedCount
    });

    return res.status(200).json({
      message: alreadySaved ? "Removed from saved" : "Post saved",
      saved: !alreadySaved,
      savedCount,
      postId,
    });
  } catch (error) {
    console.error("[SAVE_POST_ERROR]", error);
    return res.status(500).json({ message: "Error during saving post", error: error.message });
  }
};




export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ fixed
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({
      author: { $in: user.following }
    })
      .populate("author", "name username profileImage")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch following posts" });
  }
};


// export const getFollowerPosts = async (req, res) => {
//   try {
//     // req.user.id is already coming from isAuth
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Get posts only from people the user follows
//     const posts = await Post.find({
//       author: { $in: user.following }
//     }).sort({ createdAt: -1 });

//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
