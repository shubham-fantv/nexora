import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import RenderMarkdown from "../RenderMarkdown";
import moment from "moment";
import ThinkingAnimation from "../common/Thinking";
export function LeftPanel({
  message,
  setMessage,
  content,
  leftSectionData,
  sendMessage,
  handleKeyPress,
  isLoading,
  tabs,
}) {
  const responseContainerRef = useRef(null);
  const [staticTabs, setStaticTabs] = useState(["Create a detailed script", "Create Characters"]);
  useEffect(() => {
    setStaticTabs(tabs);
  }, [tabs]);

  useEffect(() => {
    if (responseContainerRef.current) {
      responseContainerRef.current.scrollTop = responseContainerRef.current.scrollHeight;
    }
  }, [content, leftSectionData]);

  const handleClickPrompt = (item) => {
    if (!isLoading) {
      setMessage((prev) => item);
      sendMessage(item);
    }
  };
  const renderChatMessages = () => {
    if (leftSectionData && leftSectionData.length > 0) {
      return leftSectionData.map((item, index) => {
        if (item.sender) {
          return (
            <div key={`sender-${index}`} className=" flex flex-row-reverse rounded-lg  m-3 ">
              <div className="flex items-center gap-3   bg-[#F3F5FF] w-[80%] rounded-lg p-2  shadow-md" style={{border: '1px solid #DDE2FF'}}>
                <div className="w-8 h-8 rounded-full bg-[#FFD0D0] flex items-center justify-center text-gray-800 flex-shrink-0">
                  N
                </div>
                <p className="text-[#5D5D5D] text-base font-normal">{item.sender.message}</p>
              </div>
            </div>
          );
        } else if (item.receiver) {
          return (
            <div key={`receiver-${index}`} className="w-[100%] rounded-lg pl-3 p-2 mb-3">
              <div className="text-sm text-[#5D5D5D]">
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
    <div className="w-[30%] p-4 flex flex-col gap-4 relative h-full mt-2 ">
      <div
        ref={responseContainerRef}
        className=" bg-[#FFFFFF]  relative rounded-lg  overflow-y-auto mb-[168px] w-full scrollbar-hide"
        style={{border:'2px solid #DDE2FF'}}
      >
        {renderChatMessages()}

        <div className="sticky bottom-0 left-4 right-4  bg-[#f7f7f7]">
          <ThinkingAnimation isThinking={isLoading} />
        </div>
      </div>

      <div className="absolute bottom-32 left-4 right-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 w-max whitespace-nowrap">
          {staticTabs.map((item, i) => (
            <button
              onClick={() => handleClickPrompt(item)}
              key={i}
              style={{border: '1.5px solid #DDE2FF'}}
              className="border border-[#18181826] bg-[#FFF] rounded-lg px-4 py-2 text-sm hover:bg-gray-700/10 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4 border-2 border-[#6B61FF] bg-[#FFF] rounded-lg p-4 flex items-center">
        <textarea
          rows={3}
          type="text"
          placeholder="Give prompt here"
          className="bg-transparent flex-grow text-sm text-[#686868] outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={isLoading}
          className="w-8 h-8 bg-[#181818] rounded flex items-center justify-center ml-2 cursor-pointer "
        >
          {isLoading ? (
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <img src="/images/submit.svg" alt="Submit" />
          )}
        </button>
      </div>
    </div>
  );
}
