import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { LeftPanel } from "../../src/component/detail/LeftPanel";
import { MainPanel } from "../../src/component/detail/MainPanel";
import { RightPanel } from "../../src/component/detail/RightPanel";
import fetcher from "../../src/dataProvider";
import { quotes } from "../../src/utils/common";
import { BookOpen, User, LayoutDashboard, Video } from "lucide-react";

const initialTabs = [
  { label: "Script", icon: <BookOpen size={18} /> },
  { label: "Character", icon: <User size={18} /> },
  { label: "Storyboard", icon: <LayoutDashboard size={18} /> },
];

// Main App Component
export default function ScriptWritingApp({ slug }) {
  const [activeTab, setActiveTab] = useState("Script");

  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);

  const [content, setContent] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [leftSection, setLeftSection] = useState();
  const [tabs, setTabs] = useState([]);
  const [synopsis, setSynopsis] = useState("");
  const [script, setScript] = useState("");
  const [prevScript, setPrevScript] = useState("");
  const [nextScript, setNextScript] = useState("");
  const [character, setCharacter] = useState([]);
  const [storyboard, setStoryboard] = useState("");
  const [prevPrompt, setPrevPrompt] = useState("");
  const [currEpisode, setCurrEpisode] = useState(null);
  const [currScene, setCurrScene] = useState(null);
  const [availableTabs, setAvailableTabs] = useState(initialTabs);

  const [episodes, setEpisodes] = useState("");
  const [finalVideo, setFinalVideo] = useState("");

  const { mutate: getActiveTab } = useMutation((obj) => fetcher.post(`/get_destination`, obj), {
    onSuccess: (response) => {
      setActiveTab(response?.destination);
    },
    onError: (error) => {
      alert(error.response.data.message);
      console.error("Error generating video:", error);
    },
  });

  const { mutate: generateVideoApi } = useMutation((obj) => fetcher.post(`/chat/send`, obj), {
    onSuccess: (response) => {
      setIsLoading(false);

      if (response?.final_video?.length > 0) {
        setAvailableTabs((prevTabs) => {
          if (!prevTabs.some((tab) => tab.label === "Videos")) {
            return [
              ...prevTabs,
              { label: "Videos", icon: <Video size={18} /> },
            ];
          }
          return prevTabs;
        });
      }
      updateStateFromParsedData(response);
      setMessage("");
    },
    onError: (error) => {
      alert(error.response.data.message);
      setIsLoading(false);
      console.error("Error generating video:", error);
    },
  });

  const { mutate: loadMore } = useMutation((obj) => fetcher.post(`/chat/action`, obj), {
    onSuccess: (response) => {
      setIsLoading(false);
      if (response?.final_video?.length > 0) {
        setAvailableTabs((prevTabs) => {
          if (!prevTabs.some((tab) => tab.label === "Videos")) {
            return [
              ...prevTabs,
              { label: "Videos", icon: <Video size={18} /> },
            ];
          }
          return prevTabs;
        });
      }
      updateStateFromParsedData(response);
      setMessage("");
      setIsLoadMore(false);
    },
    onError: (error) => {
      alert(error.response.data.message);
      setIsLoading(false);
      setIsLoadMore(false);
      console.error("Error generating video:", error);
    },
  });

  const sendMessage = async (item) => {
    setIsLoading(true);
    setContent("");
    setPrevPrompt(item || message);
    generateVideoApi({ session_id: slug, prompt: item || message });
    getActiveTab({ session_id: slug, prompt: item || message });
  };

  const updateStateFromParsedData = (data) => {
    if (data.prompt !== undefined) setPrompt(data.prompt);
    if (data.left_section !== undefined) setLeftSection(data.left_section);
    if (data.tabs !== undefined) setTabs(data.tabs);
    if (data.synopsis !== undefined) setSynopsis(data.synopsis);
    if (data.script !== undefined) setScript(data.script);
    if (data.next_script !== undefined) setNextScript(data.next_script);
    if (data.prev_script !== undefined) setPrevScript(data.prev_script);
    if (data.character !== undefined) setCharacter(data.character);
    if (data.storyboard !== undefined) setStoryboard(data.storyboard);
    if (data.episodes !== undefined) setEpisodes(data.episodes);
    if (data.final_video !== undefined) setFinalVideo(data.final_video);
    if (data.curr_scene !== undefined) setCurrScene(data.curr_scene);
    if (data.curr_episode !== undefined) setCurrEpisode(data.curr_episode);
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
    if (!isLoading) return;

    const pickRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setSubTitle(quotes[randomIndex]);
    };

    pickRandomQuote();
    const interval = setInterval(pickRandomQuote, 5000);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleCreateVideo = (item) => {};

  return (
    <div className="relative flex text-black h-[92vh] bg-[#F3F5FF] ">
      {/* <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[100%] h-[512px] max-h-[512px] bg-no-repeat bg-center bg-contain pointer-events-none z-0"
        style={{ backgroundImage: "url('/images/detail-layout.png')" }}
      /> */}

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
          prevScript={prevScript}
          nextScript={nextScript}
          characterData={character}
          storyboardData={storyboard}
          isLoading={isLoading}
          isFullWidth={!!episodes?.length == 0}
          handleCreateVideo={handleCreateVideo}
          finalVideoData={finalVideo}
          setFinalVideo={setFinalVideo}
          setScriptData={setScript}
          episodes={episodes}
          currEpisode={currEpisode}
          currScene={currScene}
          sendMessage={sendMessage}
          setMessage={setMessage}
          calledPrompt={message}
        />
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
