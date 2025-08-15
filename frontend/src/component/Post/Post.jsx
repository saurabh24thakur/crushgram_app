import React, { useEffect, useRef, useState } from "react";
import IconWithCount from "./IconWithCount";
import { BiLike, BiSolidLike, BiComment, BiBookmark, BiSolidBookmark } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../../config.js";

const Post = ({ postId, name, username, content, image, likes, comments, shares, profileImage, initialLiked = false, initialSaved = false }) => {
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(likes || 0);
  const [commentCount, setCommentCount] = useState(comments || 0);
  const [shareCount, setShareCount] = useState(shares || 0);
  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);
  const [commentsList, setCommentsList] = useState([]);
  const [newComment, setNewComment] = useState("");
  const inputRef = useRef(null);

  // Load comments
  const loadComments = async () => {
    try {
      const res = await fetch(`${serverURL}/api/post/comment/${postId}`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        const list = data.comments || data.comment || [];
        setCommentsList(list);
        setCommentCount(list.length);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadComments(); }, [postId]);

  const handleLike = async () => {
    try {
      const res = await fetch(`${serverURL}/api/post/like/${postId}`, { method: "PATCH", credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        setLiked(data.liked);
        setLikeCount(data.likesCount);
      }
    } catch (err) { console.error(err); }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const message = newComment.trim();
    if (!message) return;

    try {
      const res = await fetch(`${serverURL}/api/post/comment/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (res.ok) { loadComments(); setNewComment(""); }
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${serverURL}/api/post/save/${postId}`, { method: "PATCH", credentials: "include" });
      const data = await res.json();
      if (res.ok) setSaved(data.saved);
    } catch (err) { console.error(err); }
  };

  const focusCommentInput = () => inputRef.current?.focus();

  return (
    <div className="bg-white rounded-lg shadow-sm w-full">
      <div className="flex gap-4 items-center px-4 py-2">
        <div onClick={() => navigate(`profile/${username}`)} className="w-14 h-14 rounded-full bg-cover bg-center cursor-pointer" style={{ backgroundImage: `url(${profileImage})` }} />
        <div><div className="font-medium text-base text-[#111416]">{name}</div></div>
      </div>

      <div className="px-4 pb-3"><p className="text-base text-[#111416] leading-6">{content}</p></div>

      {image && <div className="w-full h-auto aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />}

      <div className="flex flex-wrap justify-between px-4 py-2 gap-3 sm:gap-6">
        <div onClick={handleLike} className="cursor-pointer">
          <IconWithCount icon={liked ? BiSolidLike : BiLike} count={likeCount} active={liked} />
        </div>
        <div onClick={focusCommentInput} className="cursor-pointer">
          <IconWithCount icon={BiComment} count={commentCount} />
        </div>
        <div onClick={handleSave} className="cursor-pointer">
          <IconWithCount icon={saved ? BiSolidBookmark : BiBookmark} count={null} active={saved} />
        </div>
      </div>

      <div className="px-4 pb-4 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Comments ({commentCount})</h4>
        {commentsList?.length ? commentsList.map((c) => (
          <div key={c._id ?? `${c.author}-${c.message}`} className="flex items-start gap-3">
            <img src={c?.author?.profileImage || "https://via.placeholder.com/32"} alt={c?.author?.username || "user"} className="w-8 h-8 rounded-full object-cover" />
            <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-full">
              <div className="text-sm">
                <span className="font-medium mr-2">{c?.author?.username || "User"}</span>{c?.message}
              </div>
              {c?.createdAt && <div className="text-[10px] text-gray-500 mt-1">{new Date(c.createdAt).toLocaleString()}</div>}
            </div>
          </div>
        )) : <p className="text-sm text-gray-500">Be the first to comment.</p>}

        <form onSubmit={handleAddComment} className="flex items-center gap-2">
          <input ref={inputRef} type="text" placeholder="Write a comment..." className="flex-1 p-2 border rounded-lg outline-none" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
          <button type="submit" disabled={!newComment.trim()} className="bg-blue-500 text-white px-3 py-2 rounded-lg disabled:opacity-50">Post</button>
        </form>
      </div>
    </div>
  );
};

export default Post;
