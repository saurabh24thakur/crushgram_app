import React from 'react';
import vector013 from "../../../src/assets/vec2.png";
import logo from "../../../src/assets/logo.png";

import { HiOutlineHome } from "react-icons/hi2";
import { RiUserCommunityLine } from "react-icons/ri";
import { FaRegPlusSquare } from "react-icons/fa";
import { MdLiveTv } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';



function Navbar() {
  const navigate = useNavigate();
  const {userData}=useSelector(state=>state.user)
  return (
    <div className="flex justify-between items-center px-4 sm:px-6 md:px-10 py-3 border-b border-[#e5e8ea] w-full bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2 sm:gap-4">
        <img src={logo} className='w-[100px] h-[60px]' />
        <h1 className="text-xl sm:text-2xl font-semibold font-[Edu NSW ACT Cursive]">
          Crushgram
        </h1>
      </div>

      {/* Search bar for larger screens */}
      <div className="flex-1 mx-4 hidden sm:flex">
        <div
          className="w-full bg-[#eff2f4] rounded-lg px-4 py-2 flex items-center text-sm sm:text-base text-[#607589] cursor-pointer"
          onClick={() => navigate('/search')}
        >
          Search
        </div>
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {/* Search icon only for mobile */}
        <div
          className="block sm:hidden bg-[#eff2f4] p-2 rounded-lg cursor-pointer"
          onClick={() => navigate('/search')}
        >
          <BiSearch className="text-xl text-[#607589]" />
        </div>

        <div className="bg-[#eff2f4] p-2 rounded-lg" onClick={() => navigate('/')}>
          <HiOutlineHome className="text-lg sm:text-xl" />
        </div>
        <div className="bg-[#eff2f4] p-2 rounded-lg" onClick={() => navigate('/message')}>
          <RiUserCommunityLine className="text-lg sm:text-xl" />
        </div>
        <div className="bg-[#eff2f4] p-2 rounded-lg" onClick={() => navigate('/follower')}>
          <MdLiveTv className="text-lg sm:text-xl" />
        </div>
        <div className="bg-[#eff2f4] p-2 rounded-lg" onClick={() => navigate('post/upload')}>
          <FaRegPlusSquare className="text-lg sm:text-xl" />
        </div>
        <div className="bg-[#eff2f4] p-2 rounded-lg" onClick={() => navigate('/notification')}>
          <IoMdNotificationsOutline className="text-lg sm:text-xl" />
        </div>
        <div className="bg-[#eff2f4] p-2 rounded-lg" onClick={() => navigate('/profile')}>
        <img
  src={userData?.profileImage || vector013}
  alt="Profile"
  className="w-7 h-7 sm:w-6 sm:h-6"
/>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[url(/depth-4-frame-1.png)] bg-cover bg-center" />
      </div>
    </div>
  );
}

export default Navbar;
