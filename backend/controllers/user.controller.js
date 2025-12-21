import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { io, getReceiverSocketId } from "../socket.js";


// Example controller
// controllers/userController.js
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; // or req.userId
    const user = await User.findById(userId)
      .select("-password")
      .populate("follower", "name username profileImage")
      .populate("following", "name username profileImage")
      .populate("posts");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error during current user fetching", error: error.message });
  }
};

// Search users by username (partial match)
export const searchUsersByUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ message: "Username query is required" });
    }

    const users = await User.find({
      username: { $regex: username, $options: "i" }, // Case-insensitive partial match
    }).select("name username profileImage");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};







// Follow a user
export const followUser = async (req, res) => {
  try {
    console.log("req.user:", req.user);
    console.log("req.params.id:", req.params.id);

    const currentUserId = req.user.id; // or req.userId
    const userIdToFollow = req.params.id;

    if (currentUserId === userIdToFollow) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    const userToFollow = await User.findById(userIdToFollow);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (currentUser.following.includes(userIdToFollow)) {
      return res.status(400).json({ message: "You are already following this user." });
    }

    currentUser.following.push(userIdToFollow);
    userToFollow.follower.push(currentUserId);

    await currentUser.save();
    await userToFollow.save();

    // Real-time notification: emit to the followed user
    const receiverSocketId = getReceiverSocketId(userIdToFollow);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newFollower", {
        _id: currentUser._id,
        name: currentUser.name,
        username: currentUser.username,
        profileImage: currentUser.profileImage,
        timestamp: new Date(),
        type: "follow",
        read: false,
      });
      console.log(`[NOTIFICATION] Follow notification sent to ${userToFollow.username}`);
    }

    res.status(200).json({ message: "Successfully followed the user." });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
// Unfollow a user
export const unfollowUser = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const userIdToUnfollow = req.params.id;

        if (currentUserId === userIdToUnfollow) {
            return res.status(400).json({ message: "You cannot unfollow yourself." });
        }

        const userToUnfollow = await User.findById(userIdToUnfollow);
        const currentUser = await User.findById(currentUserId);

        if (!userToUnfollow || !currentUser) {
            return res.status(404).json({ message: "User not found." });
        }

        currentUser.following = currentUser.following.filter(
            (id) => id.toString() !== userIdToUnfollow
        );
        userToUnfollow.follower = userToUnfollow.follower.filter(
            (id) => id.toString() !== currentUserId
        );

        await currentUser.save();
        await userToUnfollow.save();

        res.status(200).json({ message: "Successfully unfollowed the user." });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};






export const editProfile = async (req, res) => {
  try {
    const { name, username, bio, profession, gender } = req.body;

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const sameUserWithUsername = await User.findOne({ username }).select("-password");
    if (sameUserWithUsername && sameUserWithUsername._id.toString() !== req.user.id) {
      return res.status(400).json({ message: "Username already exists" });
    }

    //  Handle profile image if uploaded
    if (req.file) {
      const uploadedImage = await uploadOnCloudinary(req.file.path);
      if (uploadedImage?.url) {
        user.profileImage = uploadedImage.url;
        console.log(" Image uploaded to Cloudinary:", uploadedImage.url); // Verification
      } else {
        console.warn(" Image upload failed or returned no URL");
      }
    }

    //  Update other fields
    user.name = name;
    user.username = username;
    user.bio = bio;
    user.profession = profession;
    user.gender = gender;

    await user.save();

    console.log(" Profile updated successfully:", user); //Verification log
    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Edit profile failed:", error);
    return res.status(400).json({
      message: "Edit profile failed",
      error: error.message,
    });
  }
};




export const getProfile = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username })
      .select("-password")
      .populate("follower", "name username profileImage")
      .populate("following", "name username profileImage")
      .populate("posts");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: "Get Profile error", error });
  }
};






// GET /api/user/:userName/followers
export const getUserFollowers = async (req, res) => {
  try {
    const handle = req.params.userName;

    const user = await User.findOne({
      $or: [{ userName: handle }, { username: handle }],
    })
      .select("follower")
      .populate("follower", "name userName username profileImage");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user.follower || []);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching followers", error: error.message });
  }
};

// GET /api/user/:userName/following
export const getUserFollowing = async (req, res) => {
  try {
    const handle = req.params.userName;

    const user = await User.findOne({
      $or: [{ userName: handle }, { username: handle }],
    })
      .select("following")
      .populate("following", "name userName username profileImage");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user.following || []);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching following", error: error.message });
  }
};

// Optional: GET /api/user/:userName/social (both lists together)
export const getUserSocial = async (req, res) => {
  try {
    const handle = req.params.userName;

    const user = await User.findOne({
      $or: [{ userName: handle }, { username: handle }],
    })
      .select("follower following")
      .populate("follower", "name userName username profileImage")
      .populate("following", "name userName username profileImage");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      follower: user.follower || [],
      following: user.following || [],
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching social lists", error: error.message });
  }
};
