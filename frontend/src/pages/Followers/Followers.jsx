import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverURL } from "../../config.js";
import vector0 from "../../assets/pic1.jpg";

function Followers({ type = "follower", title, isCurrentUser = false, data }) {
  const navigate = useNavigate();
  const { userName: routeUserName } = useParams();
  const { userdata, userData } = useSelector((s) => s.user);

  // Determine which user’s list to fetch
  const currentHandle =
    userdata?.userName ||
    userdata?.username ||
    userData?.userName ||
    userData?.username;

  const handle = isCurrentUser ? currentHandle : routeUserName;
  const segment = type === "following" ? "following" : "followers";
  const pageTitle = title || data?.title || (segment === "following" ? "Following" : "Followers");

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(!data?.list?.length);
  const [error, setError] = useState("");

  useEffect(() => {
    // If a static list is passed via data, don't fetch
    if (data?.list?.length) {
      setList(data.list);
      setLoading(false);
      return;
    }

    if (!handle) return;

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${serverURL}/api/user/${encodeURIComponent(handle)}/${segment}`,
          { withCredentials: true }
        );
        if (!cancelled) setList(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.message || e.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [handle, segment, data?.list]);

  return (
    <div className="flex flex-col min-h-[800px] items-start relative bg-[#f6e3e3]">
      <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
        <div className="items-start justify-center px-40 py-5 flex-1 grow flex relative self-stretch w-full">
          <div className="flex flex-col max-w-[960px] items-start relative flex-1 grow gap-3">
            <div className="flex flex-wrap items-start justify-around gap-[12px_12px] p-4 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col w-72 items-start relative">
                <div className="relative self-stretch mt-[-1.00px] font-bold text-[#111416] text-[32px] leading-10">
                  {pageTitle}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="px-4 py-2 text-[#607589]">Loading {segment}...</div>
            ) : error ? (
              <div className="px-4 py-2 text-red-600">Error: {error}</div>
            ) : list && list.length > 0 ? (
              list.map((user, idx) => {
                const uname = user.username || user.userName || user._id;
                return (
                  <div
                    key={user._id || idx}
                    className="flex min-h-[72px] items-center gap-4 px-4 py-2 w-full bg-white cursor-pointer hover:bg-gray-100 transition rounded-lg"
                    onClick={() => navigate(`/profile/${uname}`)}
                  >
                    <img
                      src={user.profileImage || vector0}
                      alt={user.name || uname}
                      className="w-14 h-14 rounded-full object-cover"
                      onError={(e) => (e.currentTarget.src = vector0)}
                    />
                    <div className="flex flex-col items-start justify-center">
                      <p className="font-medium text-[#111416] text-base leading-6">
                        {user.name || uname}
                      </p>
                      <span className="text-sm text-[#607589] leading-[21px]">
                        @{uname}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-2 text-[#607589]">No users found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Followers;