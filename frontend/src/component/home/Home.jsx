import React, { useEffect, useState } from "react";
import Post from "../Post/Post";
import { serverURL } from "../../config.js";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${serverURL}/api/post/feed`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        console.log("Feed API response:", data); // Check this log in your browser console

        // --- THE FIX IS HERE ---
        // Your backend sends a plain array `[...]`.
        // This code now correctly checks if `data` itself is an array.
        if (res.ok && Array.isArray(data)) {
          // We set the state with the `data` array directly.
          setPosts(data);
        } else {
          // This will run if the API response is not ok, or if the data is not an array.
          console.error("API response was not a successful array:", data);
          setPosts([]); // Set to empty array on failure
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // The empty array [] is correct and prevents any reloading loops.

  if (loading) return <p>Loading...</p>;

  return (
    <div className="home-container">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post._id}
            postId={post._id}
            name={post.author?.name}
            username={post.author?.username}
            time={post.createdAt}
            content={post.caption}
            image={post.media}
            likes={post.likes?.length || 0}
            comments={post.comments?.length || 0}
            shares={post.shares || 0}
            profileImage={post.author?.profileImage}
            initialLiked={post.likedByCurrentUser}
            initialSaved={post.savedByCurrentUser}
          />
        ))
      ) : (
        <p>No posts to display. Follow other users to see their posts here!</p>
      )}
    </div>
  );
};

export default Home;