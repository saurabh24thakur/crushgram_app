// src/hooks/useCurrentUser.js (FINAL CORRECTED VERSION)
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice"; // This import is correct

export default function useCurrentUser() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3002/api/auth/currentuser", {
          credentials: "include",
        });

        if (!isMounted) return;

        if (res.ok) {
          const data = await res.json();
          // FIX: Use the imported function name 'setUserData'
          dispatch(setUserData(data.user || null));
        } else {
          // FIX: Use the imported function name 'setUserData'
          dispatch(setUserData(null));
        }
      } catch (err) {
        console.error("Error fetching current user:", err);
        // FIX: On error, dispatch null to clear the user state.
        // Also use the correct function name 'setUserData'.
        dispatch(setUserData(null));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [dispatch, userData]);

  return { loading };
}