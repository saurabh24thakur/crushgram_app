import React from "react";
import Post from "../Post/Post";

import Story from "../Story/story";


import vector08 from "../../../src/assets/react.svg";
import vector09 from "../../../src/assets/react.svg";
import vector010 from "../../../src/assets/react.svg";

import pic1 from "../../../src/assets/pic1.jpg";




export const Home = () => {
  return (
    <div className="flex flex-col items-start bg-white w-full">
      <div className="flex flex-col min-h-screen w-full">
       
        
        <Story/>

        {/* Feed Section */}
        <div className="flex justify-center px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-5 w-full">
          <div className="w-full max-w-[960px] flex flex-col gap-6">
            {/* All Posts */}
            <Post
              name="Sophia Bennett"
              time="2d"
              content="Just finished a great workout! Feeling energized and ready to tackle the day. #fitness #healthylifestyle"
              image={pic1}
              likes={23}
              comments={5}
              shares={2}
              likeIcon={vector08}
              commentIcon={vector09}
              shareIcon={vector010}
              profileImage={vector010}
            />
        
            
            
          </div>
        </div>
      </div>
    </div>
  );
};

