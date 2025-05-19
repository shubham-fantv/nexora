import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { LeftPanel } from "../../src/component/detail/LeftPanel";
import { MainPanel } from "../../src/component/detail/MainPanel";
import { RightPanel } from "../../src/component/detail/RightPanel";
import fetcher from "../../src/dataProvider";
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

  const [episodes, setEpisodes] = useState("");

  const { mutate: generateVideoApi } = useMutation((obj) => fetcher.post(`/chat/send`, obj), {
    onSuccess: (response) => {
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
    if (data.episodes !== undefined) setEpisodes(data.episodes);
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

  const handleCreateVideo = (item) => {};

  return (
    <div className="relative flex text-black h-[90vh]">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[512px] max-h-[512px] bg-no-repeat bg-center bg-contain pointer-events-none z-0"
        style={{ backgroundImage: "url('/images/detail-layout.png')" }}
      />

      <div className="relative flex flex-1 z-10">
        <LeftPanel
          message={message}
          setMessage={setMessage}
          leftSectionData={leftSection}
          response={content}
          sendMessage={sendMessage}
          handleKeyPress={handleKeyPress}
          isLoading={isLoading}
          tabs={tabs}
        />

        <MainPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          availableTabs={availableTabs}
          synopsisData={synopsis}
          scriptData={script}
          characterData={character}
          storyboardData={storyboard}
          isLoading={isLoading}
          isFullWidth={!!episodes?.length == 0}
          handleCreateVideo={handleCreateVideo}
        />

        {!episodes?.length == 0 && <RightPanel setMessage={setMessage} episodeData={episodes} />}
      </div>
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
