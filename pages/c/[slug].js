import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import RenderMarkdown from "../../src/component/RenderMarkdown";
import { LeftPanel } from "../../src/component/detail/LeftPanel";
import { MainPanel } from "../../src/component/detail/MainPanel";
import { RightPanel } from "../../src/component/detail/RightPanel";
import { useMutation } from "react-query";
import fetcher from "../../src/dataProvider";
import Loader from "../../src/component/common/Loading/loading";
import { quotes } from "../../src/utils/common";
// Main App Component
export default function ScriptWritingApp({ slug }) {
  const [activeTab, setActiveTab] = useState("Synopsis");

  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [content, setContent] = useState("");
  const [buffer, setBuffer] = useState("");
  const [subTitle, setSubTitle] = useState("");
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

  const { mutate: generateVideoApi } = useMutation((obj) => fetcher.post(`/chat/send`, obj), {
    onSuccess: (response) => {
      console.log("🚀 ~ const{mutate:generateVideoApi}=useMutation ~ response:", response);
      setIsLoading(false);
      updateStateFromParsedData(response);
    },
    onError: (error) => {
      alert(error.response.data.message);
      setIsLoading(false);
      console.error("Error generating video:", error);
    },
  });

  const sendMessage = async () => {
    // if (!message.trim()) return;
    setIsLoading(true);
    setContent("");
    generateVideoApi({ session_id: slug, prompt: message });
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
    sendMessage();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    const pickRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setSubTitle(quotes[randomIndex]);
    };
    pickRandomQuote();
    const interval = setInterval(pickRandomQuote, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex bg-black text-white"
      style={{ height: "calc(100vh - 60px)", maxHeigh: "calc(100vh - 60px)" }}
    >
      {isLoading && <Loader title={"Please wait"} subTitle={subTitle} />}
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
