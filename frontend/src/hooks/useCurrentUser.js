// src/hooks/useCurrentUser.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { serverURL } from "../config.js";
import axios from "axios";

export default function useCurrentUser() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${serverURL}/api/auth/me`, {
          withCredentials: true,
        });
        dispatch(setUserData(res.data));
      } catch (err) {
        dispatch(setUserData(null));
      } finally {
        setLoading(false);
      }
    };

    if (userData) {
      setLoading(false);
    } else {
      fetchUser();
    }
  }, [dispatch, userData]);

  return { loading };
}
