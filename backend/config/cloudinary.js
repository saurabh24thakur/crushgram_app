import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (file) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET, // typo fixed
    });

    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });

    if (fs.existsSync(file)) {
      fs.unlinkSync(file); // delete local file after upload
    }

    return result;

  } catch (error) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file); // ensure file is cleaned up on error too
    }
    console.error("Cloudinary upload failed:", error);
    return null;
  }
};

export default uploadOnCloudinary;
