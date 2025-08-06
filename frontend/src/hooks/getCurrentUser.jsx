import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { setUserData } from "../redux/userSlice";
import { serverURL } from "../App";

function GetCurrentUser() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${serverURL}/api/user/current`, {
          withCredentials: true,
        });

        // Backend returns raw user object, not { user: ... }
        if (res.data && res.data._id) {
          dispatch(setUserData(res.data));
        }
      } catch (err) {
        console.log("Not logged in or error fetching user:", err.message);
      }
    };

    fetchUser();
  }, [location.pathname]); // refetch on route change

  return null; // doesn't render anything visually
}

export default GetCurrentUser;
