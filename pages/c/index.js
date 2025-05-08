import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import ReactMarkdown from "react-markdown";

// Main App Component
export default function ScriptWritingApp() {
  const [activeTab, setActiveTab] = useState("Synopsis");

  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [content, setContent] = useState("");
  const [buffer, setBuffer] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    setResponse(""); // Clear previous response

    try {
      const response = await fetch("http://20.244.14.85:8080/chat/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ message: message }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        const lines = chunk.split("\n");
        for (let line of lines) {
          if (line.startsWith("data:")) {
            const data = line.replace(/^data:\s*/, "");

            if (data === "[DONE]") return;

            // Append the new data to the buffer and content
            setBuffer((prev) => {
              const newText = prev + data;
              setContent((c) => c + data + "\n");
              return newText;
            });
          }
        }

        setResponse((prev) => prev + chunk);
      }
    } catch (err) {
      console.error("Error:", err);
      setResponse("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex bg-black text-white" style={{ height: "calc(100vh - 60px)" }}>
      <LeftPanel
        message={message}
        setMessage={setMessage}
        response={content}
        // content={content}
        sendMessage={sendMessage}
        handleKeyPress={handleKeyPress}
        isLoading={isLoading}
      />
      <MainPanel activeTab={activeTab} setActiveTab={setActiveTab} />
      <RightPanel />
    </div>
  );
}

function LeftPanel({ message, setMessage, response, sendMessage, handleKeyPress, isLoading }) {
  const responseContainerRef = useRef(null);

  // Auto-scroll to bottom when response updates
  useEffect(() => {
    if (responseContainerRef.current) {
      responseContainerRef.current.scrollTop = responseContainerRef.current.scrollHeight;
    }
  }, [response]);

  return (
    <div className="w-1/3 p-4 flex flex-col gap-4 bg-black relative h-full">
      {/* User Prompt - For demo purposes showing previous prompt */}
      <div className="bg-[#242424] rounded-lg p-4 border border-[#FFFFFF26]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-gray-800 flex-shrink-0">
            N
          </div>
          <p className="text-gray-300 mt-2">Create a story about crypto billionaire</p>
        </div>
      </div>

      {/* Response Container */}
      <div
        ref={responseContainerRef}
        className="bg-[#242424] border border-[#FFFFFF26] rounded-lg p-4 flex-grow overflow-y-auto mb-20"
      >
        {response ? (
          <div className="text-sm text-gray-300 whitespace-pre-wrap">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Response will appear here...</div>
        )}
      </div>

      {/* Action Buttons */}
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

// function LeftPanel() {
//   return (
//     <div className="w-1/3 p-4 flex flex-col gap-4 bg-black">
//       {/* User Prompt */}
//       <div className="bg-[#242424] rounded-lg p-4  border border-[#FFFFFF26]">
//         <div className="flex items-start gap-3">
//           <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-gray-800 flex-shrink-0">
//             N
//           </div>
//           <p className="text-gray-300 mt-2">Create a story about crypto billionaire</p>
//         </div>
//       </div>

//       <div className="bg-[#242424] border border-[#FFFFFF26] rounded-lg p-4 flex-grow overflow-y-auto">
//         <div className="mb-4">
//           <p className="font-medium text-lg mb-2">
//             Here is your beautiful story about the Crypto Billionaire, who went from rags to riches
//             with modern twist
//           </p>
//           <p className="text-sm text-gray-400 text-center my-4">
//             Generate a detailed Script for Episode 01
//           </p>
//         </div>

//         <div className="mt-4">
//           <p className="text-sm mb-2">
//             Here is the Detailed Script for Episode 01 with the breakdow by Scene by Scene. Brief
//             Overview:-
//           </p>
//           <p className="text-sm text-gray-300">
//             A bustling Mumbai slum. Sounds of trains, vendors, and kids playing cricket. We meet
//             19-year-old AJAY VERMA, barefoot, pushing a cart of water cans.
//           </p>
//         </div>

//         <div className="mt-4">
//           <p className="text-sm mb-2">Would you like to me:-</p>
//           <ol className="list-decimal list-inside text-sm ml-2 space-y-1">
//             <li>Add more detailed scene description</li>
//             <li>Do you want to me create images for the scenes.</li>
//             <li>Do you want detailed Scene 1 scripting with dialogue</li>
//             <li>Do you want the list of characters in Scene 1</li>
//           </ol>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex gap-2">
//         <button className="bg-[#242424] border border-[#FFFFFF26] rounded-md px-4 py-2 text-sm flex-grow hover:bg-gray-700/50 transition-colors">
//           Create a detailed script for Scene1
//         </button>
//         <button className="bg-[#242424] border border-[#FFFFFF26] rounded-md px-4 py-2 text-sm flex-grow hover:bg-gray-700/50 transition-colors">
//           Create Characters
//         </button>
//       </div>

//       {/* Create Button - Sticky at bottom */}
//       <div className="bg-[#242424] border border-[#FFFFFF26] rounded-lg p-4 flex items-center justify-between mt-auto">
//         <textarea
//           rows={3}
//           type="text"
//           placeholder="Give prompt here"
//           className="bg-transparent flex-grow text-gray-300 outline-none"
//         />
//         <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center ml-2 cursor-pointer">
//           <svg
//             width="20"
//             height="20"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//           >
//             <path d="M12 5v14M5 12h14" />
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// }

// Main Panel Component
function MainPanel({ activeTab, setActiveTab }) {
  const tabs = ["Synopsis", "Script", "Character", "Storyboard"];

  const [avatarPosition, setAvatarPosition] = useState({ x: 650, y: 100 });

  return (
    <div className="w-2/4 flex flex-col bg-black">
      {/* Tabs */}
      <div className="flex gap-2 p-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-md ${
              activeTab === tab ? "bg-blue-200 text-gray-800" : "bg-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-auto bg-[#242424] border border-[#FFFFFF26] rounded-lg p-6 relative">
        <h2 className="text-2xl font-bold mb-6">Crypto Billionaire</h2>

        <div className="mb-6">
          <p className="text-lg mb-4">Overview</p>
        </div>
      </div>
    </div>
  );
}

// Right Panel Component
function RightPanel() {
  const episodes = Array.from({ length: 9 }, (_, i) => `Episode ${String(i + 1).padStart(2, "0")}`);
  const [expandedEpisode, setExpandedEpisode] = useState(null);

  return (
    <div className="w-1/5 p-4 bg-black">
      <div className="bg-[#242424] border border-[#FFFFFF26] rounded-lg p-2 flex flex-col gap-2 h-full">
        <div className="border border-[#FFFFFF40] rounded-md p-3 mb-2 flex items-center justify-between">
          <span>Episode 01</span>
        </div>

        {episodes.slice(1).map((episode) => (
          <div
            key={episode}
            className="border border-[#FFFFFF26] rounded-md p-3 flex items-center justify-between cursor-pointer"
          >
            <span>{episode}</span>
            <ChevronDown
              size={20}
              className={`transition-transform ${expandedEpisode === episode ? "rotate-180" : ""}`}
              onClick={() => setExpandedEpisode(episode === expandedEpisode ? null : episode)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
