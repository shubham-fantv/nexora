import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import RenderMarkdown from "../../src/component/RenderMarkdown";
import { LeftPanel } from "../../src/component/detail/LeftPanel";
import { MainPanel } from "../../src/component/detail/MainPanel";
import { RightPanel } from "../../src/component/detail/RightPanel";
// Main App Component
export default function ScriptWritingApp({ slug }) {
  const [activeTab, setActiveTab] = useState("Synopsis");

  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [content, setContent] = useState("");
  const [buffer, setBuffer] = useState("");

  const [prompt, setPrompt] = useState("");
  const [leftSection, setLeftSection] = useState();
  const [tabs, setTabs] = useState([]);
  const [synopsis, setSynopsis] = useState("");
  const [script, setScript] = useState("");
  const [character, setCharacter] = useState([]);
  const [storyboard, setStoryboard] = useState("");
  const [availableTabs, setAvailableTabs] = useState([
    "Synopsis",
    "Script",
    "Character",
    "Storyboard",
  ]);

  const sendMessage = async () => {
    // if (!message.trim()) return;

    setIsLoading(true);
    setContent("");

    try {
      const response = await fetch("http://20.244.14.85:8080/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ session_id: slug, prompt: message }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Process complete data lines
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep the last incomplete line in buffer

        for (let line of lines) {
          if (line.startsWith("data:")) {
            const dataContent = line.replace(/^data:\s*/, "").trim();

            if (dataContent === "[DONE]") {
              console.log("Stream complete");
              continue;
            }

            if (dataContent.startsWith("RESPONSE_JSON:")) {
              try {
                const jsonStr = dataContent.replace("RESPONSE_JSON:", "").trim();
                const parsedData = JSON.parse(jsonStr);

                updateStateFromParsedData(parsedData);

                setContent((prev) => prev + chunk);
              } catch (jsonError) {
                console.error("Error parsing JSON:", jsonError);
              }
            } else {
              setContent((prev) => prev + dataContent);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStateFromParsedData = (data) => {
    if (data.prompt !== undefined) setPrompt(data.prompt);
    if (data.left_section !== undefined) setLeftSection(data.left_section);
    if (data.tabs !== undefined) setTabs(data.tabs);
    if (data.synopsis !== undefined) setSynopsis(data.synopsis);
    if (data.script !== undefined) setScript(data.script);
    if (data.character !== undefined) setCharacter(data.character);
    if (data.storyboard !== undefined) setStoryboard(data.storyboard);
  };

  useEffect(() => {
    sendMessage;
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div
      className="flex bg-black text-white"
      style={{ height: "calc(100vh - 60px)", maxHeigh: "calc(100vh - 60px)" }}
    >
      <LeftPanel
        message={message}
        setMessage={setMessage}
        leftSectionData={leftSection}
        response={content}
        sendMessage={sendMessage}
        handleKeyPress={handleKeyPress}
        isLoading={isLoading}
      />

      <MainPanel
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        availableTabs={availableTabs}
        synopsisData={synopsis}
        scriptData={script}
        characterData={character}
        storyboardData={storyboard}
      />

      <RightPanel />
    </div>
  );
}

export async function getServerSideProps(ctx) {
  try {
    const {
      params: { slug },
    } = ctx;

    return {
      props: {
        slug,
      },
    };
  } catch (err) {
    console.log("error occures in while getting data==>", err);
    return {
      props: {},
    };
  }
}
