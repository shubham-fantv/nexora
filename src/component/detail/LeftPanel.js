import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import RenderMarkdown from "../RenderMarkdown";
export function LeftPanel({
  message,
  setMessage,
  content,
  leftSectionData,
  sendMessage,
  handleKeyPress,
  isLoading,
}) {
  const responseContainerRef = useRef(null);

  // Auto-scroll to bottom when content updates
  useEffect(() => {
    if (responseContainerRef.current) {
      responseContainerRef.current.scrollTop = responseContainerRef.current.scrollHeight;
    }
  }, [content, leftSectionData]);

  // Render chat messages from leftSectionData
  const renderChatMessages = () => {
    if (leftSectionData && leftSectionData.length > 0) {
      return leftSectionData.map((item, index) => {
        if (item.sender) {
          return (
            <div
              key={`sender-${index}`}
              className="bg-[#242424] rounded-lg p-4 border border-[#FFFFFF26] mb-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-gray-800 flex-shrink-0">
                  N
                </div>
                <p className="text-gray-300 mt-2">{item.sender.message}</p>
              </div>
            </div>
          );
        } else if (item.receiver) {
          return (
            <div
              key={`receiver-${index}`}
              className="bg-[#242424] rounded-lg p-4 border border-[#FFFFFF26] mb-3"
            >
              <div className="text-sm text-gray-300">
                <RenderMarkdown markdown={item.receiver.message} />
              </div>
            </div>
          );
        }
        return null;
      });
    }
  };

  return (
    <div className="w-1/3 p-4 flex flex-col gap-4 bg-black relative h-full">
      <div
        ref={responseContainerRef}
        className="bg-[#242424] border border-[#FFFFFF26] rounded-lg p-4 flex-grow overflow-y-auto mb-[128px]"
      >
        {renderChatMessages()}
      </div>

      <div className="flex gap-2 absolute bottom-24 left-4 right-4">
        <button className="bg-[#242424] border border-[#FFFFFF26] rounded-md px-4 py-2 text-sm flex-grow hover:bg-gray-700/50 transition-colors">
          Create a detailed script
        </button>
        <button className="bg-[#242424] border border-[#FFFFFF26] rounded-md px-4 py-2 text-sm flex-grow hover:bg-gray-700/50 transition-colors">
          Create Characters
        </button>
      </div>

      {/* Input box sticky at bottom */}
      <div className="absolute bottom-4 left-4 right-4 bg-[#242424] border border-[#FFFFFF26] rounded-lg p-4 flex items-center">
        <input
          type="text"
          placeholder="Give prompt here"
          className="bg-transparent flex-grow text-gray-300 outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center ml-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
