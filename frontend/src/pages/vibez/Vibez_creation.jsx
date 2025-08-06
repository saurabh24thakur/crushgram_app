import React, { useState } from "react";

const Vibez_creation = () => {
  const [caption, setCaption] = useState("");
  const [tagged, setTagged] = useState("");
  const [audience, setAudience] = useState("Public");

  return (
    <div className="bg-[#fdfcef] min-h-screen px-6 py-8 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900">Create a VIBE</h1>

      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl w-full max-w-2xl h-64 flex flex-col items-center justify-center text-center px-4">
        <p className="font-semibold text-gray-700">Drag photos and videos here</p>
        <p className="text-sm text-gray-500 mt-1">Or select from computer</p>
        <button className="mt-4 bg-[#f4f2d8] hover:bg-[#ecead0] text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow">
          Select from computer
        </button>
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
        <label className="block text-sm font-medium text-gray-800 mb-2">Tag people</label>
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
        <label className="block text-sm font-medium text-gray-800 mb-2">Audience</label>
        <div className="flex gap-4">
          <button
            onClick={() => setAudience("Public")}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              audience === "Public"
                ? "bg-black text-white"
                : "bg-white text-gray-800 border-gray-300"
            }`}
          >
            Public
          </button>
          <button
            onClick={() => setAudience("Followers only")}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              audience === "Followers only"
                ? "bg-black text-white"
                : "bg-white text-gray-800 border-gray-300"
            }`}
          >
            Followers only
          </button>
        </div>
      </div>

      {/* Post Button */}
      <div className="w-full max-w-2xl flex justify-end mt-10">
        <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-2 rounded-full shadow transition">
          Post
        </button>
      </div>
    </div>
  );
};

export default Vibez_creation;
