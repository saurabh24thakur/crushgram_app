import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../../App";

import vector04 from "../../../src/assets/user1.jpg";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // Function to handle user profile navigation
  const handleUserProfileClick = (username) => {
    navigate(`/profile/${username}`);
  };

  // ✅ Trigger search whenever query changes (debounce optional later)
  useEffect(() => {
    if (query.trim()) {
      console.log("Searching for:", query);
      axios
        .get(`${serverURL}/api/user/search?q=${query}`, {
          withCredentials: true,
        })
        .then((res) => {
          console.log("API Response:", res);
          const data = res.data;

          // Ensure we always have an array
          if (Array.isArray(data)) {
            setResults(data);
          } else if (data && typeof data === "object") {
            // If API returns single object, wrap it
            setResults([data]);
          } else {
            setResults([]);
          }
        })
        .catch((err) => {
          console.error("Search failed:", err);
          console.error("Error details:", err.response?.data);
          setResults([]);
        });
    } else {
      setResults([]); // Clear results if query is empty
    }
  }, [query]); // Run this effect when query changes

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      // No need to call handleSearch separately since useEffect handles it
    }
  };

  return (
    <div className="flex flex-col items-start relative bg-white">
      <div className="flex flex-col min-h-[800px] items-start relative self-stretch w-full flex-[0_0_auto] bg-white">
        <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
          <div className="items-start justify-center px-40 py-5 flex-1 grow flex relative self-stretch w-full">
            <div className="flex flex-col max-w-[960px] items-start relative flex-1 grow mb-[-1.00px]">

              {/* Search Bar */}
              <div className="w-full px-4 mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search by username"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => setQuery(query)} // Triggers useEffect via state change
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Trends Section */}
              <div className="flex flex-col h-[60px] items-start pt-5 pb-3 px-4 relative self-stretch w-full">
                <div className="relative self-stretch mt-[-1.00px] font-bold text-[#111416] text-[22px] leading-7">
                  Trends for you
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 p-4 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-start gap-3 relative flex-1 self-stretch w-full grow">
                  {["#TechTuesday", "#FitnessFriday", "#TravelTuesday"].map((tag, index) => (
                    <div key={index} className="flex w-[301px] items-center gap-3 p-4 bg-white rounded-lg border border-[#dbe0e5]">
                      <div className="inline-flex flex-col items-start">
                        <div className="font-bold text-[#111416] text-base leading-5 whitespace-nowrap">{tag}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Users */}
              <div className="flex flex-col h-[60px] items-start pt-5 pb-3 px-4 relative self-stretch w-full">
                <div className="font-bold text-[#111416] text-[22px] leading-7">
                  Suggested Users
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 p-4 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-start gap-3 relative flex-1 self-stretch w-full grow">
                  {["Sophia Bennett", "Ethan Carter", "Olivia Davis"].map((name, index) => (
                    <div key={index} className="flex flex-col w-[301px] items-start gap-3 pt-0 pb-3 px-0">
                      <div className="px-4 py-0 flex flex-col items-center w-full">
                        <div className="w-[120px] h-[120px] rounded-full overflow-hidden">
                          <img src={vector04} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div className="flex flex-col items-center self-stretch w-full">
                        <div className="font-medium text-[#111416] text-base text-center">{name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search Results Section */}
              {results.length > 0 && (
                <div className="px-4 w-full">
                  <h2 className="font-bold text-[18px] text-[#111416] mt-4">Search Results</h2>
                  <div className="flex gap-4 mt-2 flex-wrap">
                    {results.map((user, index) => (
                      <div
                        key={user._id || user.username || index}
                        className="w-[301px] items-center gap-3 p-4 bg-white rounded-lg border border-[#dbe0e5] flex flex-col cursor-pointer"
                        onClick={() => handleUserProfileClick(user.username)}
                      >
                        <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
                          <img
                            src={user.profileImage || vector04}
                            alt={user.username || "User"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-center text-[#111416] font-medium text-base">
                          {user.name || user.username || "Unknown User"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;