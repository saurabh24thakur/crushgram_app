import React, { useState } from 'react';
import IconWithCount from './IconWithCount';
import { BiLike, BiComment, BiShare } from "react-icons/bi";

const Post = ({ name, time, content, image, likes, comments, shares, profileImage }) => {
  const [likeCount, setLikeCount] = useState(likes || 0);
  const [commentCount, setCommentCount] = useState(comments || 0);
  const [shareCount, setShareCount] = useState(shares || 0);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleComment = () => {
    // This would open comment box in a real app
    setCommentCount(prev => prev + 1);
    alert("Comment clicked!");
  };

  const handleShare = () => {
    setShareCount(prev => prev + 1);
    alert("Post shared!");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm w-full">
      {/* Profile */}
      <div className="flex gap-4 items-center px-4 py-2">
        <div
          className="w-14 h-14 rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url(${profileImage})` }}
        />
        <div>
          <div className="font-medium text-base text-[#111416]">{name}</div>
          <div className="text-sm text-[#607589]">{time}</div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-base text-[#111416] leading-6">{content}</p>
      </div>

      {/* Image */}
      <div
        className="w-full h-auto aspect-video bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between px-4 py-2 gap-3 sm:gap-6">
        <div onClick={handleLike} className="cursor-pointer">
          <IconWithCount icon={BiLike} count={likeCount} active={liked} />
        </div>
        <div onClick={handleComment} className="cursor-pointer">
          <IconWithCount icon={BiComment} count={commentCount} />
        </div>
        <div onClick={handleShare} className="cursor-pointer">
          <IconWithCount icon={BiShare} count={shareCount} />
        </div>
      </div>
    </div>
  );
};

export default Post;
