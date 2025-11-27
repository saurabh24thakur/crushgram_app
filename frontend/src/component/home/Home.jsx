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
        console.log("Feed API response:", data); 


        if (res.ok && Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("API response was not a successful array:", data);
          setPosts([]); 
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); 

  if (loading) return <p>Loading...</p>;

  return (
    <div className="home-container flex flex-col gap-2 p-4 pt-20">
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