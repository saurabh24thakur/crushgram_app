import React from 'react'

function SenderMessage({message}) {
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex justify-end">
      {message.image && <img src={message.image} alt="" className="max-w-xs rounded-lg" />}
      {message.message && (
        <div className="flex flex-col items-end">
          <div className="px-4 py-2 rounded-lg bg-blue-100">
            {message.message}
          </div>
          <span className="text-xs text-gray-400 mt-1 mr-2">
            {formatTime(message.createdAt)}
          </span>
        </div>
      )}
    </div>
  )
}

export default SenderMessage

