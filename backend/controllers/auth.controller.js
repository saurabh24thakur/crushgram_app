import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

// SIGNUP CONTROLLER
export const signup = async (req, res) => {
    try {
      const { name, email, password, username } = req.body;
  
      const findByEmail = await User.findOne({ email });
      if (findByEmail) {
        return res.status(400).json({ message: "User already exists!" });
      }
  
      if (password.length < 6) {
        return res.status(400).json({ message: "Password should be more than 5 characters." });
      }
  
      const findByUsername = await User.findOne({ username });
      if (findByUsername) {
        return res.status(400).json({ message: "Username already taken!" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 9); // ✅ await here
  
      const user = await User.create({  // ✅ await here too
        name,
        email,
        username,
        password: hashedPassword,
      });
  
      const token = genToken(user._id); // you can keep this sync as shown earlier
  
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 10 * 12 * 365 * 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "Strict",
      });
  
      return res.status(201).json(user);
    } catch (error) {
      console.error("❌ Error during signup:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  
//LOGIN CONTROLLER
export const login = async (req, res) => {
  try {
    const { password, username } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is not correct!" });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Strict", // or "Lax" during development
        secure: false, // true if using HTTPS
        maxAge: 10 * 365 * 24 * 60 * 60 * 1000 // 10 years
      });
      

    return res.status(200).json(user);

  } catch (error) {
    console.log("Error during signin", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// LOGOUT CONTROLLER
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "Successfully signed out"
    });
  } catch (error) {
    console.log("Error during logout", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
