import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../../App";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice";

function Signup() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const dispatch=useDispatch()

  const handleSignup = async () => {
    setLoading(true);


    try {
      const response = await axios.post(
        `${serverURL}/api/auth/signup`,
        { name, username, email, password },
        { withCredentials: true }
      );
     dispatch(setUserData(response.data))
      
      navigate("/");


    } catch (error) {
      if (error.response) {
        console.log("Backend Error:", error.response.data);
        alert(error.response.data.message || "Signup failed!");
      } else if (error.request) {
        console.error("No response received from server:", error.request);
        alert("No response from server. Check your backend.");
      } else {
        console.error("Unexpected error:", error.message);
        alert("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#111416] mb-6">
          Create your account
        </h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 border border-[#DBE0E5] rounded-xl text-[#607589] focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-3 border border-[#DBE0E5] rounded-xl text-[#607589] focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-[#DBE0E5] rounded-xl text-[#607589] focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Password input with eye icon */}
        <div className="relative mb-6">
          <input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-[#DBE0E5] rounded-xl text-[#607589] focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
          />
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </div>
        </div>

        <button
          className="w-full bg-[#338EF2] text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition flex justify-center"
          onClick={handleSignup}
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Sign Up"}
        </button>

        <p className="text-center text-[#607589] text-sm my-4">Or sign up with</p>

        <div className="flex gap-3">
          <button className="w-1/2 bg-[#EFF2F4] text-sm font-bold text-[#111416] py-3 rounded-xl hover:bg-gray-200 transition">
            SearchEngineCo
          </button>
          <button className="w-1/2 bg-[#EFF2F4] text-sm font-bold text-[#111416] py-3 rounded-xl hover:bg-gray-200 transition">
            SocialNet
          </button>
        </div>

        <p className="text-center text-[#607589] text-sm mt-6">
          Already have an account?{" "}
          <span
            className="text-[#338EF2] font-medium hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

        <p className="text-center text-[#607589] text-xs mt-6">
          By signing up, you agree to our{" "}
          <span className="underline">Terms</span>,{" "}
          <span className="underline">Privacy Policy</span> and{" "}
          <span className="underline">Cookie Use</span>.
        </p>
      </div>
    </div>
  );
}

export default Signup;
