import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { markAsRead } from "../../redux/notificationSlice";
import vector0 from "../../assets/pic1.jpg";

function Notification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications } = useSelector(state => state.notification);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      dispatch(markAsRead(notification._id));
    }
    if (notification.type === "follow") {
      navigate(`/profile/${notification.username}`);
    }
  };

  return (
    <div className="flex flex-col min-h-[800px] items-start relative bg-[#f6e3e3]">
      <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
        <div className="items-start justify-center px-4 sm:px-8 md:px-20 lg:px-40 py-5 flex-1 grow flex relative self-stretch w-full">
          <div className="flex flex-col max-w-[960px] items-start relative flex-1 grow gap-3">
            <div className="flex flex-wrap items-start justify-around gap-[12px_12px] p-4 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col w-72 items-start relative">
                <div className="relative self-stretch mt-[-1.00px] font-bold text-[#111416] text-[32px] leading-10">
                  Notifications
                </div>
              </div>
            </div>

            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-[#607589] w-full">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id || `${notification.username}-${notification.timestamp}`}
                  className={`flex min-h-[72px] items-center gap-4 px-4 py-2 w-full rounded-lg cursor-pointer transition rounded-lg ${
                    notification.read ? 'bg-white' : 'bg-blue-50'
                  } hover:bg-gray-100`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <img
                    src={notification.profileImage || vector0}
                    alt={notification.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />

                  <div className="flex flex-col items-start justify-center flex-1">
                    <p className="font-medium text-[#111416] text-base leading-6">
                      <span className="font-bold">{notification.name}</span> started following you
                    </p>
                    <span className="text-sm text-[#607589] leading-[21px]">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>

                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;
