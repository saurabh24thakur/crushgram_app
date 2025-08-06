import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js"
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("-password").populate("posts vibez");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({
      message: "Error during current user fetching",
      error: error.message,
    });
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






export const editProfile = async (req, res) => {
  try {
    const { name, username, bio, profession, gender } = req.body;

    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const sameUserWithUsername = await User.findOne({ username }).select("-password");
    if (sameUserWithUsername && sameUserWithUsername._id.toString() !== req.userId) {
      return res.status(400).json({ message: "Username already exists" });
    }

    //  Handle profile image if uploaded
    if (req.file) {
      const uploadedImage = await uploadOnCloudinary(req.file.path);
      if (uploadedImage?.url) {
        user.profileImage = uploadedImage.url;
        console.log("✅ Image uploaded to Cloudinary:", uploadedImage.url); // Verification
      } else {
        console.warn("⚠️ Image upload failed or returned no URL");
      }
    }

    // ✅ Update other fields
    user.name = name;
    user.username = username;
    user.bio = bio;
    user.profession = profession;
    user.gender = gender;

    await user.save();

    console.log("✅ Profile updated successfully:", user); // ✅ Verification log
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




export const getProfile = async(req,res)=>{
  try {
    const userName= req.params.userName;
    const user=await User.findOne({userName}).select("-password");
    if(!user){
      return res.status(400).json({message:"User not found"})

    }

    return res.status(200).json(user)
  } catch (error) {
    return res.status(400).json({message:"Get Profile error",error})
    
  }
}
