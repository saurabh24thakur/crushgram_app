import React, { useState } from 'react';
import vector013 from "../../../src/assets/vec2.png";
import logo from "../../../src/assets/logo.png";

import { HiOutlineHome } from "react-icons/hi2";
import { IoSearch } from "react-icons/io5";
import { RiUserCommunityLine } from "react-icons/ri";
import { FaRegPlusSquare } from "react-icons/fa";
import { MdLiveTv } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiSearch } from "react-icons/bi";
import { FiMenu } from 'react-icons/fi'; // Hamburger icon
import { AiOutlineClose } from 'react-icons/ai'; // Close icon
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Navbar() {
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { icon: <HiOutlineHome className="text-lg sm:text-xl" />, path: '/' },
    { icon: <RiUserCommunityLine className="text-lg sm:text-xl" />, path: '/message' },
    { icon: <MdLiveTv className="text-lg sm:text-xl" />, path: '/follower' },
    { icon: <FaRegPlusSquare className="text-lg sm:text-xl" />, path: 'post/upload' },
    { icon: <IoMdNotificationsOutline className="text-lg sm:text-xl" />, path: '/notification' },
  ];

  return (
    <div className="relative flex justify-between items-center px-4 sm:px-6 md:px-10 py-1 border-b border-[#e5e8ea] w-full bg-white ">
      {/* Logo */}
      <div className="flex items-center gap-2 sm:gap-4">
        <img src={logo} className='w-[90px] h-[60px]' alt="Crushgram logo" />
        <h1 className="text-xl sm:text-2xl font-semibold font-[Edu NSW ACT Cursive]">
          Crushgram
        </h1>
      </div>

      {/* Search bar for larger screens */}
      <div className="flex-1 mx-4 hidden sm:flex">
        
      </div>

      {/* Right side icons for larger screens */}
      <div className="hidden sm:flex items-center gap-2 sm:gap-3 md:gap-4">
      <div
          className=" bg-[#eff2f4] rounded-lg px-2 py-2 flex items-center text-sm sm:text-base text-[#607589] cursor-pointer"
          onClick={() => navigate('/search')}
        >
          <IoSearch className='text-lg sm:text-xl'/>

        </div>
        {navLinks.map((link, index) => (
          <div key={index} className="bg-[#eff2f4] p-2 rounded-lg cursor-pointer" onClick={() => navigate(link.path)}>
            {link.icon}
          </div>
        ))}
        <div className="bg-[#eff2f4] p-2 rounded-lg cursor-pointer" onClick={() => navigate('/profile')}>
          <img
            src={userData?.profileImage || vector013}
            alt="Profile"
            className="w-7 h-7 sm:w-6 sm:h-6 rounded-full object-cover"
          />
        </div>
      </div>

      {/* Hamburger menu for mobile */}
      <div className="sm:hidden flex items-center">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <AiOutlineClose className="text-2xl" /> : <FiMenu className="text-2xl" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-[#e5e8ea] sm:hidden">
          <div className="flex flex-col items-center gap-4 py-4">
            <div
              className="w-11/12 bg-[#eff2f4] rounded-lg px-4 py-2 flex items-center text-sm text-[#607589] cursor-pointer"
              onClick={() => { navigate('/search'); setIsMenuOpen(false); }}
            >
              <BiSearch className="text-xl text-[#607589] mr-2" />
              Search
            </div>
            {navLinks.map((link, index) => (
              <div key={index} className="w-full text-center py-2 cursor-pointer hover:bg-gray-100" onClick={() => { navigate(link.path); setIsMenuOpen(false); }}>
                {link.icon}
              </div>
            ))}
            <div className="w-full text-center py-2 cursor-pointer hover:bg-gray-100" onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}>
              <img
                src={userData?.profileImage || vector013}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
