// src/hooks/useSocket.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSocket } from "../socket/client";
import { setConnected, setOnlineUsers } from "../redux/socketSlice";

export default function useSocket(userId) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    const socket = getSocket();

    const onConnect = () => {
      dispatch(setConnected(true));
      socket.emit("join", userId); // join user-specific room, if you use that
    };
    const onDisconnect = () => dispatch(setConnected(false));
    const onOnlineUsers = (list) => dispatch(setOnlineUsers(list));

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("online-users", onOnlineUsers);

    if (!socket.connected) socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("online-users", onOnlineUsers);
      // optional: keep it connected across pages. If you want to tear down:
      // socket.disconnect();
    };
  }, [userId, dispatch]);
}