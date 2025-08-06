import React from "react";
import image from "../../assets/user2.png";
import vector0 from "../../assets/pic1.jpg";

function Notification() {
  return (
    <div className="flex flex-col min-h-[800px] items-start relative bg-white">
      <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
        <div className="items-start justify-center px-40 py-5 flex-1 grow flex relative self-stretch w-full">
          <div className="flex flex-col max-w-[960px] items-start relative flex-1 grow gap-3">
            <div className="flex flex-wrap items-start justify-around gap-[12px_12px] p-4 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col w-72 items-start relative">
                <div className="relative self-stretch mt-[-1.00px] [font-family:'Plus_Jakarta_Sans-Bold',Helvetica] font-bold text-[#111416] text-[32px] tracking-[0] leading-10">
                 Notifications....
                </div>
              </div>
            </div>

{/* message of users / folllowers
 */}
            

            <div
              className="flex min-h-[72px] items-center gap-4 px-4 py-2 w-full bg-white cursor-pointer hover:bg-gray-100 transition   border-b-1 border-gray-500"
              onClick={() => console.log("Component clicked")} // <-- Replace with your navigation logic
            >
              {/* Circular Image */}
              <img
                src={image}
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover"
              />

              {/* Text Section */}
              <div className="flex flex-col items-start justify-center">
                <p className="font-medium text-[#111416] text-base leading-6">
                  kaalu khattta mar gya
                </p>
                <span className="text-sm text-[#607589] leading-[21px]">
                  1d
                </span>
              </div>
            </div>

            <div
              className="flex min-h-[72px] items-center gap-4 px-4 py-2 w-full bg-white cursor-pointer hover:bg-gray-100 transition   border-b-2"
              onClick={() => console.log("Component clicked")} // <-- Replace with your navigation logic
            >
              {/* Circular Image */}
              <img
                src={image}
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover"
              />

              {/* Text Section */}
              <div className="flex flex-col items-start justify-center">
                <p className="font-medium text-[#111416] text-base leading-6">
                  kaalu khattta mar gya
                </p>
                <span className="text-sm text-[#607589] leading-[21px]">
                  1d
                </span>
              </div>
            </div>
           

           
            <div
              className="flex min-h-[72px] items-center gap-4 px-4 py-2 w-full bg-white cursor-pointer hover:bg-gray-100 transition   border-b-2"
              onClick={() => console.log("Component clicked")} // <-- Replace with your navigation logic
            >
              {/* Circular Image */}
              <img
                src={image}
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover"
              />

              {/* Text Section */}
              <div className="flex flex-col items-start justify-center">
                <p className="font-medium text-[#111416] text-base leading-6">
                  kaalu khattta mar gya
                </p>
                <span className="text-sm text-[#607589] leading-[21px]">
                  1d
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;
