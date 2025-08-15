import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../../config.js";
import vector02 from "../../assets/vec2.png";
import { setProfileData, setUserData } from "../../redux/userSlice";
import axios from "axios";

function ProfileEdit() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    username: "",
    bio: "",
    profession: "",
    gender: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.name || "",
        username: userData.username || "", // ✅ fixed field
        bio: userData.bio || "",
        profession: userData.profession || "",
        gender: userData.gender || "",
        image: null, // only handle local File on change
      });
      setPreviewImage(userData.image || null);
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("username", form.username);
      formData.append("bio", form.bio);
      formData.append("profession", form.profession);
      formData.append("gender", form.gender);

      if (form.image instanceof File) {
        formData.append("profileImage", fileInputRef.current.files[0]);

      }

      const result = await axios.post(`${serverURL}/api/user/editProfile`, formData, {
        withCredentials: true,
      });

      dispatch(setProfileData(result.data));
      dispatch(setUserData(result.data));
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Profile update failed:", error.response?.data || error);
      alert("Profile update failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4 sm:px-10 md:px-20">
      <div className="w-full max-w-xl">
        <h1 className="text-[#111416] text-[32px] font-bold mb-8 ml-1">
          Edit profile
        </h1>

        <div className="flex flex-col items-center gap-4 mb-6">
          <img
            src={previewImage || vector02}
            alt="Profile Preview"
            className="w-40 h-40 rounded-full object-cover border"
          />
          <button
            onClick={triggerFileInput}
            className="bg-[#D1E2F2] text-sm font-semibold text-[#111416] py-2 px-4 rounded-lg"
          >
            Edit Image
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="flex flex-col gap-6">
          <InputField label="Name" name="name" value={form.name} onChange={handleChange} />
          <InputField label="Username" name="username" value={form.username} onChange={handleChange} />
          <TextareaField label="Bio" name="bio" value={form.bio} onChange={handleChange} />
          <InputField label="Profession" name="profession" value={form.profession} onChange={handleChange} />

          <div>
            <label className="text-[#111416] text-base font-bold block mb-2 ml-1">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full h-10 rounded-xl border border-[#DDE0E2] px-3 bg-white"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <button
            className="w-full bg-[#D1E2F2] py-2 rounded-[20px] mt-4"
            onClick={handleSubmit}
          >
            <span className="text-[#111416] text-sm font-bold">Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-[#111416] text-base font-bold block mb-2 ml-1">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full h-10 rounded-xl border border-[#DDE0E2] px-3 bg-white"
    />
  </div>
);

const TextareaField = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-[#111416] text-base font-bold block mb-2 ml-1">
      {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className="w-full h-36 rounded-xl border border-[#DDE0E2] px-3 py-2 bg-white resize-none"
    />
  </div>
);

export default ProfileEdit;
