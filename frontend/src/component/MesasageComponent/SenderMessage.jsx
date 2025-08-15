import React from 'react'

function SenderMessage({message}) {
  return (
    <div className="flex justify-end">
       {message.image &&
            <img src={message.img} alt="" />
           }

{message.message && 
          <div className="px-4 py-2 rounded-lg bg-blue-100">
           
          {message.message}
           
           
           </div>}
        </div>
  )
}

export default SenderMessage
