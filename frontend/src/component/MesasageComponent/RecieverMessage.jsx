import React from 'react'

function RecieverMessage({message}) {
  return (
    <div className="flex justify-start">
          

          {message.image &&
            <img src={message.img} alt="" />
           }

{message.message && 
          <div className="px-4 py-2 rounded-lg bg-gray-100">
           
          {message.message}
           
           
           </div>}
        </div>

  )
}

export default RecieverMessage
