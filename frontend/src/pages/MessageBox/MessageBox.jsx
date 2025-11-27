import React from "react";
// 1. IMPORT useDispatch, useNavigate, and your Redux action
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedUser } from "../../redux/messageSlice";

import vector0 from "../../assets/pic1.jpg";

function MessageBox() {
  // 2. CALL THE HOOKS to get the dispatch and navigate functions
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // We only need the current user's data for this component
  const { userData } = useSelector(state => state.user);

  if (!userData) return <div>Loading...</div>;

  // 3. MODIFY THE FUNCTION to accept the clicked user as an argument
  const handleMessageClick = (clickedUser) => {
    // Avoid clicking on yourself if you somehow follow yourself
    if (!clickedUser || clickedUser?._id === userData?._id) return;

    // 4. USE THE `clickedUser`'s data, NOT profileData
    const target = {
      _id: clickedUser._id,
      username: clickedUser.username,
      profilePic: clickedUser.profileImage || "",
    };

    // These will now work correctly
    dispatch(setSelectedUser(target));
    navigate(`/message/${target.username}`);
  };

  return (
    <div className="flex flex-col min-h-[800px] items-start relative bg-[#f6e3e3]">
      <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
        <div className="items-start justify-center px-4 sm:px-8 md:px-20 lg:px-40 py-5 flex-1 grow flex relative self-stretch w-full">
          <div className="flex flex-col max-w-[960px] items-start relative flex-1 grow gap-3">
            <div className="flex flex-wrap items-start justify-around gap-[12px_12px] p-4 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col w-72 items-start relative">
                <div className="relative self-stretch mt-[-1.00px] font-bold text-[#111416] text-[32px] leading-10">
                  Messages
                </div>
              </div>
            </div>

            {/* Dynamically render followers to start a conversation */}
            {userData?.follower && userData.follower.length > 0 ? (
              userData.follower.map((user) => (
                <div
                  key={user._id}
                  className="flex min-h-[72px] items-center gap-4 px-4 py-2 w-full bg-white cursor-pointer hover:bg-gray-100 transition border-b-2"
                  // 5. PASS THE `user` from the map into the click handler
                  onClick={() => handleMessageClick(user)}
                >
                  <img
                    src={user.profileImage || vector0}
                    alt={user.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="flex flex-col items-start justify-center">
                    <p className="font-medium text-[#111416] text-base leading-6">
                      {user.name}
                    </p>
                    <span className="text-sm text-[#607589] leading-[21px]">
                      @{user.username}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-[#607589]">No followers to message.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBox;