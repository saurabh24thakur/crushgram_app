import React, { useState } from "react";
import {
  FaHeart,
  FaCommentDots,
  FaShare,
  FaUser
} from "react-icons/fa";
import reel_thumb from "../../assets/reel_thumb1.jpg";

const Vibez = () => {
  const [likes, setLikes] = useState(23000);
  const [comments, setComments] = useState(123);
  const [shares, setShares] = useState(45);

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center py-8 px-4">
      {/* Main Container */}
      <div className="relative flex flex-col lg:flex-row items-center gap-6 w-full max-w-4xl">
        {/* Video/Image */}
        <div className="w-full lg:w-[500px] rounded-xl overflow-hidden shadow-md">
          <img
            src={reel_thumb}
            alt="Reel thumbnail"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-row lg:flex-col items-center justify-around gap-6 text-gray-700 text-sm mt-4 lg:mt-0 w-full lg:w-auto">
          <button
            onClick={() => setLikes(prev => prev + 1)}
            className="flex flex-col items-center hover:text-red-500 transition"
          >
            <FaHeart className="text-2xl" />
            <span className="mt-1 font-medium">{likes.toLocaleString()}</span>
          </button>
          <div className="flex flex-col items-center">
            <FaCommentDots className="text-2xl" />
            <span className="mt-1 font-medium">{comments}</span>
          </div>
          <div className="flex flex-col items-center">
            <FaShare className="text-2xl" />
            <span className="mt-1 font-medium">{shares}</span>
          </div>
          <div className="flex flex-col items-center">
            <FaUser className="text-2xl" />
            <span className="mt-1 font-medium">Olivia</span>
          </div>
        </div>
      </div>

      {/* Post Info */}
      <div className="w-full max-w-4xl mt-8 px-2">
        <p className="font-bold text-gray-900">@Olivia</p>
        <p className="mt-2 text-gray-700">
          Just finished this dance routine! What do you think?
        </p>
        <div className="mt-2 text-sm text-blue-600 space-x-2">
          <span>#dance</span>
          <span>#dancer</span>
          <span>#dancechallenge</span>
          <span>#dancelife</span>
        </div>
      </div>
    </div>
  );
};

export default Vibez;
