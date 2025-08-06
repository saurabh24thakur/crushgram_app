import React, { useState } from "react";
import axios from "axios";

const Story_creation = () => {
  const [caption, setCaption] = useState("");
  const [frontendMedia, setFrontendMedia] = useState("");
  const [backendMedia, setBackendMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFrontendMedia(URL.createObjectURL(file));
      setBackendMedia(file);
      if (file.type.includes("image")) setMediaType("image");
      else if (file.type.includes("video")) setMediaType("video");
      else setMediaType("");
    }
  };

  const handleUpload = async () => {
    if (!backendMedia || !mediaType) {
      return alert("Please select an image or video.");
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("media", backendMedia);
      formData.append("mediaType", mediaType);

      const response = await axios.post(
        "http://localhost:3002/api/story/upload",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("✅ Upload success:", response.data);
      alert("Story uploaded successfully!");

      // reset
      setFrontendMedia("");
      setBackendMedia(null);
      setMediaType("");
    } catch (error) {
      console.error("❌ Upload failed:", error.response || error.message);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#fdfcef] min-h-screen px-6 py-8 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900">
        Upload a story
      </h1>

      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl w-full max-w-2xl min-h-64 flex flex-col items-center justify-center text-center px-4 py-6 relative">
        {frontendMedia ? (
          <div className="w-full">
            {mediaType === "video" ? (
              <video
                controls
                src={frontendMedia}
                className="w-full h-64 object-cover rounded-md"
              />
            ) : (
              <img
                src={frontendMedia}
                alt="Preview"
                className="w-full h-64 object-cover rounded-md"
              />
            )}
          </div>
        ) : (
          <>
            <p className="font-semibold text-gray-700">
              Drag photos and videos here
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Or select from computer
            </p>
            <label className="mt-4 bg-[#f4f2d8] hover:bg-[#ecead0] text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow cursor-pointer">
              Select from computer
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </>
        )}
      </div>

      {/* Upload Button */}
      <div className="w-full max-w-2xl flex justify-end mt-10">
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-2 rounded-full shadow transition"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default Story_creation;
