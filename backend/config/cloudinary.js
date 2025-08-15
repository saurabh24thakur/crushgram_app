// uploadOnCloudinary.js
import dotenv from "dotenv";
dotenv.config(); // ✅ Must come before cloudinary.config

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Log all env vars to debug
// console.log("🔍 Cloudinary ENV Loaded:", {
//   CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "❌ Missing",
//   API_KEY: process.env.CLOUDINARY_API_KEY || "❌ Missing",
//   API_SECRET: process.env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ Missing",
// });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});


const uploadOnCloudinary = async (filePath) => {
  if (!filePath) {
    console.error(" No file path provided for Cloudinary upload.");
    return null;
  }

  try {
    console.log("📤 Uploading to Cloudinary from:", filePath);

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    console.log("✅ Cloudinary Upload Successful:", result.secure_url);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("🗑️ Local file deleted:", filePath);
    }

    return result;

  } catch (error) {
    console.error("❌ Cloudinary Upload Failed:", error?.message || error);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("🗑️ Local file deleted after failure:", filePath);
    }

    return null;
  }
};

export default uploadOnCloudinary;
