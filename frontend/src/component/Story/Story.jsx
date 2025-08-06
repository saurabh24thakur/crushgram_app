import React, { useEffect, useState } from "react";
import axios from "axios";

const Story = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get("http://localhost:3002/api/story/follower-stories", {
          withCredentials: true,
        });
        setStories(res.data);
      } catch (error) {
        console.error("Failed to fetch stories", error);
      }
    };

    fetchStories();
  }, []);

  return (
    <div>
      <div className="story-div w-full h-[170px] min-h-[130px] flex items-center pl-[30px] gap-5 overflow-x-auto">
        {stories.length === 0 ? (
          <p className="text-gray-500">No stories available</p>
        ) : (
          stories.map((story) => (
            <div
              className="story w-[120px] h-[120px] flex items-center flex-col"
              key={story._id}
            >
              <div className="highlighted_story_div border-4 border-yellow-300 rounded-full p-1">
                <div className="story_image rounded-full overflow-hidden w-[100px] h-[100px]">
                  {story.mediaType === "image" ? (
                    <img
                      src={story.media}
                      alt="story"
                      className="w-[100px] h-[100px] object-cover"
                    />
                  ) : (
                    <video
                      src={story.media}
                      className="w-[100px] h-[100px] object-cover"
                      muted
                      autoPlay
                      loop
                    />
                  )}
                </div>
              </div>
              <div className="story_username text-center mt-1">
                <h1 className="c text-sm font-medium text-gray-800">
                  {story.author?.username || "Unknown"}
                </h1>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Story;
