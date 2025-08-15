import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from "react-spinners";
import { useDispatch } from 'react-redux';
import axios from "axios";
import { setUserData } from '../../redux/userSlice';
import { serverURL } from "../../config.js";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${serverURL}/api/auth/login`,
        { username, password },
        { withCredentials: true }
      );

      console.log("Login Response:", response.data);

      // 🔍 check response shape
      const user = response.data.user || response.data;

      dispatch(setUserData(user)); // ✅ properly store in Redux

      alert("Login successful!");
      navigate("/");

    } catch (error) {
      if (error.response) {
        console.error("Backend Error:", error.response.data);
        alert(error.response.data.message || "Login failed!");
      } else if (error.request) {
        console.error("No response from server:", error.request);
        alert("Server is unreachable.");
      } else {
        console.error("Unexpected error:", error.message);
        alert("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#111416] mb-6">
          Log in to ConnectHub
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-3 border border-[#DBE0E5] rounded-xl text-[#607589] focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pr-10 border border-[#DBE0E5] rounded-xl text-[#607589] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          >
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </div>
        </div>

        <div className="text-sm text-[#607589] text-right mb-4 hover:underline cursor-pointer">
          <span onClick={() => navigate('/forgotpassword')}>Forgot password?</span>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-[#338EF2] text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition"
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Login"}
        </button>

        <p className="text-center text-[#607589] text-sm my-4">Or log in with</p>

        <div className="flex gap-3">
          <button className="w-1/2 bg-[#EFF2F4] text-sm font-bold text-[#111416] py-2 rounded-xl hover:bg-gray-200 transition">
            SearchEngineCo
          </button>
          <button className="w-1/2 bg-[#EFF2F4] text-sm font-bold text-[#111416] py-2 rounded-xl hover:bg-gray-200 transition">
            SocialNet
          </button>
        </div>

        <p className="text-center text-[#607589] text-sm mt-6">
          Don’t have an account?{' '}
          <span
            className="text-[#338EF2] font-medium hover:underline cursor-pointer"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
