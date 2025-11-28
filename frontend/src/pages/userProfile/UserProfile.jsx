import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileData } from '../../redux/userSlice';
import { setSelectedUser } from '../../redux/messageSlice';
import { serverURL } from "../../config";

import vector02 from "../../../src/assets/vec2.png";
import pic1 from "../../../src/assets/pic1.jpg";

function UserProfile() {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);
  const { profileData } = useSelector(state => state.user);

  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const profileHandle = profileData?.userName || profileData?.username || userName;

  const handleProfile = async () => {
    setPageLoading(true);
    try {
      const result = await axios.get(`${serverURL}/api/user/getprofile/${userName}`, { withCredentials: true });
      dispatch(setProfileData(result.data));
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
    setPageLoading(false);
  };

  useEffect(() => {
    handleProfile();
  }, [userName]);

  useEffect(() => {
    if (profileData && userData) {
      const isUserFollowing = profileData.follower?.some(
        follower => (follower._id || follower).toString() === userData._id.toString()
      );
      setIsFollowing(isUserFollowing);
    }
  }, [profileData, userData]);

  const handleFollow = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverURL}/api/user/${profileData._id}/follow`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        setIsFollowing(true);
        handleProfile();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to follow user");
    }
    setLoading(false);
  };

  const handleUnfollow = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverURL}/api/user/${profileData._id}/unfollow`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        setIsFollowing(false);
        handleProfile();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to unfollow user");
    }
    setLoading(false);
  };

  const goFollowers = () => {
    if (!profileHandle) return;
    navigate(`/profile/${profileHandle}/followers`);
  };

  const goFollowing = () => {
    if (!profileHandle) return;
    navigate(`/profile/${profileHandle}/following`);
  };

  const handleMessageClick = () => {
    if (!profileData || profileData?._id === userData?._id) return;

    const target = {
      _id: profileData._id,
      username: profileData.username || profileData.userName,
      profilePic: profileData.profileImage || profileData.profilePic || "",
    };

    dispatch(setSelectedUser(target));
    navigate(`/message/${target.username}`);
  };

  const isVideo = (url) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes('video');
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-bold">Loading profile...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col min-h-[800px] items-start bg-white">
        <div className="flex flex-col items-start w-full">
          <div className="items-center justify-center px-4 sm:px-8 md:px-12 py-4 flex-1 grow flex w-full">
            <div className="flex flex-col w-full max-w-screen-lg items-center mx-auto">
              <div className="flex items-start w-full">
                <div className="flex-col items-center gap-4 flex-1 grow flex">
                  <div className="inline-flex flex-col items-center gap-4">
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-cover rounded-full" />
                    <img
                      src={profileData?.profileImage || vector02}
                      alt=""
                      className="rounded-full w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 mt-[-10px] object-cover"
                    />

                    <div className="inline-flex flex-col items-center justify-center ">
                      <div className="inline-flex flex-col h-7 items-center">
                        <div className="font-bold text-[#111416] text-[22px] text-center leading-7">
                          {profileData?.name || "current user"}
                        </div>
                        <div className="font-bold text-[#111416] text-[22px] text-center leading-7">
                          {'@' + profileData?.profession || "no profession"}
                        </div>
                      </div>

                      <div className="inline-flex flex-col items-center">
                        <p className="mt-6 text-[#607589] text-base text-center leading-6 whitespace-normal break-words">
                          {profileData?.bio || "no bio"}
                        </p>
                      </div>

                      <div className="mb-5 font-bold text-[#111416] text-[22px] text-center leading-7">
                        {profileData?.profession || "no profession"}
                      </div>

                      <div className="inline-flex flex-col items-center">
                        <div className="text-[#607589] text-base text-center leading-6 whitespace-normal break-words">
                          <span
                            onClick={goFollowers}
                            style={{ cursor: "pointer", marginRight: 8, color: "#2f4eeb", fontWeight: 500 }}
                          >
                            {profileData?.follower?.length || 0} followers
                          </span>
                          <span style={{ margin: "0 8px" }}>·</span>
                          <span
                            onClick={goFollowing}
                            style={{ cursor: "pointer", color: "#2f4eeb", fontWeight: 500 }}
                          >
                            {profileData?.following?.length || 0} following
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full max-w-[480px] justify-center">
                    {profileData?._id !== userData?._id && (
                      <div className="flex-1 h-10 justify-center px-4 py-0 rounded-lg flex items-center bg-[#eff2f4] overflow-hidden">
                        {isFollowing ? (
                          <button
                            onClick={handleUnfollow}
                            disabled={loading}
                            className="font-bold text-[#111416] text-sm text-center leading-[21px] whitespace-nowrap w-full"
                          >
                            {loading ? "Unfollowing..." : "Following"}
                          </button>
                        ) : (
                          <button
                            onClick={handleFollow}
                            disabled={loading}
                            className="font-bold text-[#111416] text-sm text-center leading-[21px] whitespace-nowrap w-full"
                          >
                            {loading ? "Following..." : "Follow"}
                          </button>
                        )}
                      </div>
                    )}

                    <div className="h-10 px-4 py-0 rounded-lg flex items-center bg-[#2f4eeb] overflow-hidden">
                      <button
                        onClick={handleMessageClick}
                        className="font-bold text-[#111416] text-sm text-center leading-[21px] whitespace-nowrap w-24"
                      >
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start pt-0 pb-3 px-0 w-full">
                <div className="items-start gap-8 px-4 py-0 w-full border-b border-[#dbe0e5] flex">
                  <div className="inline-flex flex-col items-center justify-center pt-4 pb-[13px] border-b-[3px] border-[#e5e8ea]">
                    <div className="text-[#111416] font-bold text-sm leading-[21px] whitespace-nowrap">
                      Posts
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 w-full">
                {profileData?.posts && profileData.posts.length > 0 ? (
                  profileData.posts.map((post) => (
                    <div key={post._id} className="mb-4 rounded-lg overflow-hidden bg-white shadow-md relative">
                      {isVideo(post.media) ? (
                        <video
                          src={post.media}
                          className="block w-full h-64 object-cover"
                          
                        />
                      ) : (
                        <img
                          src={post.media || pic1}
                          alt="post"
                          className="block w-full h-64 object-cover"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-[#607589]">
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

export default UserProfile;
