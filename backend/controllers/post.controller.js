import uploadOnCloudinary from "../config/cloudinary.js";
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

   
    const newPost = await Post.create({
      caption,
      tagged,
      audience,
      mediaType,
      media: cloudinaryRes.secure_url, 
      author: req.userId,
    });

    await User.findByIdAndUpdate(req.userId, {
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

export const like = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = findById(postId);

    if (!post) return res.status(400).json({ message: "Post not found" });

    const alreadyLiked = post.like.some(
      (id) => id.toString() == req.userId.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() != req.userId.toString()
      );
    } else {
      post.likes.push(req.userId);
    }

    await post.save();
    post.populate("author", "name userName profileImage");
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: "Error during like post", error });
  }
};

// comment controller
export const comment = async (req, res) => {
  try {
    const { message } = req.body;
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    post.comment.push({
      author: req.userId,
      message,
    });
    await post.save();
    post.populate("author", "name userName profileImage");
    post.populate("comments", "comments.author");
    return res.status(200).json(post);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error during comment on post", error });
  }
};



export const savedPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    
    const user = await findById(req.userId);

    if (!post) return res.status(400).json({ message: "Post not found" });

    const alreadySaved = user.saved.some(
      (id) => id.toString() == post.toString()
    );

    if (alreadySaved) {
      user.saved = user.saved.filter(
        (id) => id.toString() != postId.toString()
      );
    } else {
      user.saved.push(postId);
    }

    await user.save();
    user.populate("saved");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error during saving post", error });
  }
};