import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileData } from '../../redux/userSlice';
import { serverURL } from '../../App';

import vector02 from "../../../src/assets/vec2.png";
import pic1 from "../../../src/assets/pic1.jpg";


function UserProfile() {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const {userdata}=useSelector(state=>state.user)


  const { profileData } = useSelector((state) => state.user);

  const handleProfile = async () => {
    try {
      const result = await axios.get(`${serverURL}/api/user/getprofile/${userName}`, { withCredentials: true });
      dispatch(setProfileData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleProfile();
  }, [userName, dispatch]);

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
                        <p className="text-[#607589] text-base text-center leading-6 whitespace-normal break-words">
                          {profileData?.follower?.length || 0} followers · {profileData?.following?.length || 0} following
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Buttons: Logout + Edit Profile */}
                  <div className="flex gap-4 w-full max-w-[480px] justify-center">
                    {/* Logout Button */}
                    <div className="flex-1 h-10 justify-center px-4 py-0 rounded-lg flex items-center bg-[#eff2f4] overflow-hidden">
                      <button
                        
                        className="font-bold text-[#111416] text-sm text-center leading-[21px] whitespace-nowrap w-full"
                      >
                       Follow
                      </button>
                    </div>

                    {/* message Button with smaller width */}
                    <div className="h-10 px-4 py-0 rounded-lg flex items-center bg-[#2f4eeb] overflow-hidden">
                      <button
                        onClick={() => navigate("/message")}
                        className="font-bold text-[#111416] text-sm text-center leading-[21px] whitespace-nowrap w-24"
                      >
                        Message
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

                  <div className="inline-flex flex-col items-center justify-center pt-4 pb-[13px] border-b-[3px] border-[#e5e8ea]">
                    <div className="text-[#607589] font-bold text-sm leading-[21px] whitespace-nowrap">
                      Photos
                    </div>
                  </div>

                  <div className="inline-flex flex-col items-center justify-center pt-4 pb-[13px] border-b-[3px] border-[#e5e8ea]">
                    <div className="text-[#607589] font-bold text-sm leading-[21px] whitespace-nowrap">
                      Videos
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 w-full">
                {profileData?.posts?.map((post, i) => (
                  <div key={i} className="mb-4 rounded-lg overflow-hidden bg-white shadow-md">
                    <img
                      src={pic1}
                      alt={`post-${i}`}
                      className="block w-full h-64 object-cover"
                    />
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
