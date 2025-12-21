import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../../redux/userSlice";
import { serverURL } from "../../config.js";
import vector02 from "../../../src/assets/vec2.png";

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${serverURL}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setUserData(res.data));
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverURL}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div>
      <div className="flex flex-col min-h-[800px] items-bg-[#f6e3e3]">
        <div className="flex flex-col items-start w-full">
          <div className="items-center justify-center px-4 sm:px-8 md:px-12 py-4 flex-1 grow flex w-full">
            <div className="flex flex-col w-full max-w-screen-lg items-center mx-auto">
              <div className="flex items-start w-full">
                <div className="flex-col items-center gap-4 flex-1 grow flex">
                  <div className="inline-flex flex-col items-center gap-4">
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-cover rounded-full" />
                    <img
                      src={userData?.profileImage || vector02}
                      alt="profile"
                      className="rounded-full w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 mt-[-10px] object-cover"
                    />

                    <div className="inline-flex flex-col items-center justify-center">
                      <div className="inline-flex flex-col h-7 items-center">
                        <div className="font-bold text-[#111416] text-[22px] text-center leading-7">
                          {userData?.name || "current user"}
                        </div>
                        <div className="font-bold text-[#111416] text-[22px] text-center leading-7">
                          {userData?.username || "no username"}
                        </div>
                      </div>

                      <div className="inline-flex flex-col items-center">
                        <p className="mt-6 text-[#607589] text-base text-center leading-6 whitespace-normal break-words">
                          {userData?.bio || "no bio"}
                        </p>
                      </div>

                      <div className="mb-5 font-bold text-[#111416] text-[22px] text-center leading-7">
                        {userData?.profession || "no profession"}
                      </div>

                      {/* Clickable followers/following */}
                      <div className="text-[#607589] text-base text-center leading-6 whitespace-normal break-words">
                        <span
                          onClick={() => navigate("/follower")}
                          style={{
                            cursor: "pointer",
                            marginRight: 8,
                            color: "#2f4eeb",
                            fontWeight: 500,
                          }}
                          tabIndex={0}
                          role="button"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") navigate("/follower");
                          }}
                        >
                          {userData?.follower?.length || 0} followers
                        </span>
                        <span style={{ margin: "0 8px" }}>·</span>
                        <span
                          onClick={() => navigate("/following")}
                          style={{
                            cursor: "pointer",
                            color: "#2f4eeb",
                            fontWeight: 500,
                          }}
                          tabIndex={0}
                          role="button"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") navigate("/following");
                          }}
                        >
                          {userData?.following?.length || 0} following
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 w-full max-w-[480px] justify-center">
                    <div className="flex-1 h-10 justify-center px-4 py-0 rounded-lg flex items-center bg-[#eff2f4] overflow-hidden">
                      <button
                        onClick={handleLogout}
                        className="font-bold text-[#111416] text-sm text-center leading-[21px] whitespace-nowrap w-full"
                      >
                        Logout
                      </button>
                    </div>

                    <div className="h-10 px-4 py-0 rounded-lg flex items-center bg-[#eff2f4] overflow-hidden">
                      <button
                        onClick={() => navigate("/editprofile")}
                        className="font-bold text-[#111416] text-sm text-center leading-[21px] whitespace-nowrap w-24"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex flex-col items-start pt-0 pb-3 px-0 w-full">
                <div className="items-start gap-8 px-4 py-0 w-full border-b border-[#dbe0e5] flex">
                  <div className="inline-flex flex-col items-center justify-center pt-4 pb-[13px] border-b-[3px] border-[#e5e8ea]">
                    <div className="text-[#111416] font-bold text-sm leading-[21px] whitespace-nowrap">
                      Posts
                    </div>
                  </div>
            
                </div>
              </div>

              {/* Posts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 w-full">
                {userData?.posts?.length > 0 ? (
                  userData.posts.map((post, i) => (
                    <div
                      key={i}
                      className="mb-4 rounded-lg overflow-hidden bg-white shadow-md"
                    >
                      {post.mediaType === 'video' ? (
                        <video
                          src={post.media}
                          autoPlay
                          loop
                          muted
                          className="block w-full h-64 object-cover"
                        />
                      ) : (
                        <img
                          src={post.media}
                          alt={`post-${i}`}
                          className="block w-full h-64 object-cover"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center w-full text-gray-500">
                    No posts yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
