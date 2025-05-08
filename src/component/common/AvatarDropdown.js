import React, { useState, useEffect, useRef } from "react";

const AvatarDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("Luke");
  const dropdownRef = useRef(null);

  const avatars = [
    // { id: "create", name: "Create", image: null },
    { id: "dream", name: "Dream", image: "/images/avatar/avatar1.png" },
    { id: "luke", name: "Luke", image: "/images/avatar/avatar2.png" },
    { id: "alex", name: "Alex", image: "/images/avatar/avatar3.png" },
    { id: "kate", name: "Kate", image: "/images/avatar/avatar1.png" },
    { id: "pablo", name: "Pablo", image: "/images/avatar/avatar2.png" },
    { id: "kate", name: "Kate", image: "/images/avatar/avatar1.png" },
  ];

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectAvatar = (name) => {
    setSelectedAvatar(name);
    setIsOpen(false);
  };

  // Find the selected avatar
  const selected = avatars.find((avatar) => avatar.name === selectedAvatar);

  return (
    <div className="w-full  text-white">
      <h3 className="text-sm font-medium mb-2">Avatar</h3>

      {/* Dropdown container with ref for detecting outside clicks */}
      <div className="relative" ref={dropdownRef}>
        {/* Selected Avatar Button */}
        <button
          onClick={toggleDropdown}
          className="h-[48px] w-full flex items-center justify-between w-full rounded-md bg-[#343434] border-0  px-2 py-1.5 mr-1     focus:outline-none"
        >
          <div className="flex items-center ">
            <div className="w-[32px] h-[32px] rounded-full mr-2  overflow-hidden ">
              {selected?.image ? (
                <img src={selected.image} alt={selected.name} className="object-cover" />
              ) : null}
            </div>
            <span className="text-sm">{selectedAvatar}</span>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </button>

        {/* Dropdown - Absolutely positioned */}
        {isOpen && (
          <div className="absolute left-0 right-0 mt-4 p-6 bg-[#343434] rounded-2xl border border-[#FFFFFF26] z-10">
            <div className="grid grid-cols-3 gap-6">
              {avatars.map((avatar) => (
                <div
                  key={avatar.id}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleSelectAvatar(avatar.name)}
                >
                  <div
                    className={`w-[49px] h-[49px] rounded-full overflow-hidden ${
                      avatar.id === "create" ? "bg-black" : "bg-purple-300"
                    } mb-2`}
                  >
                    {avatar.image ? (
                      <img
                        src={avatar.image}
                        alt={avatar.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="text-sm">{avatar.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarDropdown;
