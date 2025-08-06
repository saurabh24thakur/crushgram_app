import uploadOnCloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Vibez from "../models/vibez.model.js";

// Upload post controller

export const uploadVibez = async (req, res) => {
  try {
    const { caption } = req.body;
    let media;
    if (req.fil) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "Media file is required" });
    }

    const vibez = await Vibez.create({
      caption,
      media,
      author: req.userId,
    });
    const user = User.findById(req.userID);
    user.vibez.push(loop._id);
    await user.save();
    const populatedVibez = await Vibez.findById(vibez._id).populate(
      "author",
      "name username pprofileImage"
    );
    return res.status(201).json(populatedVibez);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error during vibez uploading", error });
  }
};



// likes controller

export const like = async (req, res) => {
  try {
    const vibezId = req.params.vibezId;
    const vibez = findById(vibezId);

    if (!vibez) return res.status(400).json({ message: "vibez not found" });

    const alreadyLiked = vibez.like.some(
      (id) => id.toString() == req.userId.toString()
    );

    if (alreadyLiked) {
      vibez.likes = vibez.likes.filter(
        (id) => id.toString() != req.userId.toString()
      );
    } else {
      vibez.likes.push(req.userId);
    }

    await vibez.save();
    vibez.populate("author", "name userName profileImage");
    return res.status(200).json(vibez);
  } catch (error) {
    return res.status(500).json({ message: "Error during like vibez", error });
  }
};

// comment controller
export const comment = async (req, res) => {
  try {
    const { message } = req.body;
    const vibezId = req.params.vibezId;

    const vibez = await Post.findById(vibezId);
    if (!vibez) {
      return res.status(400).json({ message: "Vibez not found" });
    }
    vibez.comment.push({
      author: req.userId,
      message,
    });
    await post.save();
    vibez.populate("author", "name userName profileImage");
    vibez.populate("comments", "comments.author");
    return res.status(200).json(vibez);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error during comment on Vibez", error });
  }
};



export const getAllVibez = async (req, res) => {
  try {
    const vibezs = await Vibez.find({ }).populate(
      "author",
      "name username profileImage "
      
    ).populate("comments.author");
    return res.status(200).json(vibezs);
  } catch (error) {
    return res.status(500).json({ message: "Error at vibezs retriving", error });
  }
};