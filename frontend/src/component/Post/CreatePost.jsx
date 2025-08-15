import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../../config.js";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [tagged, setTagged] = useState("");
  const [audience, setAudience] = useState("Public");
  const [frontendMedia, setFrontendMedia] = useState(null);
  const [backendMedia, setBackendMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFrontendMedia(URL.createObjectURL(file));
      setBackendMedia(file);
      if (file.type.includes("image")) setMediaType("image");
      else if (file.type.includes("video")) setMediaType("video");
      else setMediaType(null);
    }
  };

  const handlePost = async () => {
    if (!backendMedia) return alert("Please upload a media file.");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("tagged", tagged);
      formData.append("audience", audience);
      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia); 
  
      const res = await fetch(`${serverURL}/api/post/upload`, {
        method: "POST",
        body: formData,
        credentials: "include", // keep for session auth
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
  
      alert("Post uploaded successfully!");
      setCaption("");
      setTagged("");
      setFrontendMedia(null);
      setBackendMedia(null);
      setMediaType(null);
      setLoading(false);
    } catch (err) {
      alert("Error: " + err.message);
      setLoading(false);
    }
  };
  

  const handleUploadStory = () => navigate("/story/upload");
  const handleUploadVibez = () => navigate("/vibez/upload");

  return (
    <div className="bg-[#fdfcef] min-h-screen px-4 py-8 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 text-center">
        Create a post
      </h1>

      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl w-full max-w-2xl min-h-64 flex flex-col items-center justify-center text-center px-4 py-6">
        {frontendMedia ? (
          mediaType === "image" ? (
            <img
              src={frontendMedia}
              alt="Preview"
              className="rounded-xl max-h-64 object-contain"
            />
          ) : mediaType === "video" ? (
            <video
              src={frontendMedia}
              controls
              className="rounded-xl max-h-64 object-contain"
            />
          ) : (
            <p className="text-red-500">Unsupported media type</p>
          )
        ) : (
          <>
            <p className="font-semibold text-gray-700">Drag media here</p>
            <p className="text-sm text-gray-500 mt-1">Or select from computer</p>
            <label className="mt-4 bg-[#f4f2d8] hover:bg-[#ecead0] text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow cursor-pointer">
              Select from computer
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                className="hidden"
              />
            </label>
          </>
        )}
      </div>

      {/* Caption Box */}
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Write a caption..."
        className="mt-6 w-full max-w-2xl h-32 rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none shadow-sm resize-none bg-white"
      />

      {/* Tag People */}
      <div className="w-full max-w-2xl mt-6">
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Tag people
        </label>
        <input
          type="text"
          value={tagged}
          onChange={(e) => setTagged(e.target.value)}
          placeholder="Search"
          className="w-full rounded-xl border border-gray-200 px-4 py-2 text-gray-800 outline-none bg-white"
        />
      </div>

      {/* Audience */}
      <div className="w-full max-w-2xl mt-6">
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Audience
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => setAudience("Public")}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              audience === "Public"
                ? "bg-black text-white"
                : "bg-white text-gray-800 border-gray-300"
            }`}
          >
            Public
          </button>
          <button
            onClick={() => setAudience("Followers only")}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              audience === "Followers only"
                ? "bg-black text-white"
                : "bg-white text-gray-800 border-gray-300"
            }`}
          >
            Followers only
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-2xl flex flex-wrap justify-end gap-4 mt-10">
        <button
          onClick={handleUploadStory}
          className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-2 rounded-full shadow transition"
        >
          Upload Story
        </button>
        <button
          onClick={handleUploadVibez}
          className="bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-2 rounded-full shadow transition"
        >
          Upload Vibez
        </button>
        <button
          onClick={handlePost}
          disabled={loading || !backendMedia}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-2 rounded-full shadow transition disabled:opacity-60"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
