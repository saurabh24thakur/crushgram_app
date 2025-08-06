import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import pic1 from "../../assets/pic2.jpg";

const Story = () => {
  const [likes, setLikes] = useState(1200);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikes((prev) => prev - 1);
    } else {
      setLikes((prev) => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="bg-[#fdfcef] min-h-screen px-6 py-4">
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Story</h1>

      {/* Post Content */}
      <div className="flex justify-center my-6">
        <div className="relative w-full max-w-3xl">
          <img
            src={pic1}
            alt="Story visual"
            className="w-full rounded-md shadow-md object-cover"
          />
          <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white bg-black bg-opacity-60 p-4 rounded-full text-xl hover:bg-opacity-80">
            ▶
          </button>
        </div>
      </div>

      {/* Like Button */}
      <div className="flex justify-center text-gray-700 text-sm mb-6">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-all duration-300 ${
            liked ? "text-red-500 scale-110" : "hover:text-red-600"
          }`}
        >
          <FaHeart
            className={`text-4xl transition-all duration-300 ${
              liked ? "fill-red-500 scale-125" : "fill-gray-400"
            }`}
          />
          <span className="font-medium text-3xl">{likes.toLocaleString()}</span>
        </button>
      </div>
    </div>
  );
};

export default Story;
