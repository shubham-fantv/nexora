import React, { useEffect, useState } from "react";
import RenderMarkdown from "../RenderMarkdown";
import CharacterGrid from "./CharacterGrid";
import StoryboardUI from "./StoryboardUI";
import LoadingPreview from "../common/LoadingPreview";
import fetcher from "../../dataProvider";
import { useMutation } from "react-query";
import { useRouter } from "next/router";
import LoadingMarquee from "../common/LoadingMarquee";
import { RightPanel } from "./RightPanel";

export function MainPanel({
  activeTab,
  setActiveTab,
  availableTabs,
  characterData,
  storyboardData,
  isLoading,
  isFullWidth,
  handleCreateVideo,
  finalVideoData,
  setFinalVideo,
  scriptData,
  setScriptData,
  episodes,
  sendMessage,
  currEpisode,
  currScene,
  setMessage,
  calledPrompt,
}) {
  const router = useRouter();
  const [isVideoGeneration, setIsVideoGeneration] = useState(false);
  const [storyboardFinal, setStoryboardFinal] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [selectedEpisode, setSelectedEpisode] = useState(currEpisode > 0 ? currEpisode : 1);
  const [selectedScene, setSelectedScene] = useState(currScene > 0 ? currScene : 1);

  const [slideOffset, setSlideOffset] = useState(0);

  const { mutate: generateVideoApi } = useMutation(
    (obj) => fetcher.post(`/merge_scene_videos`, obj),
    {
      onSuccess: (response) => {
        setFinalVideo(response?.merged_videos);
        setIsVideoGeneration(false);
      },
      onError: (error) => {
        setIsVideoGeneration(false);
        console.error("Error generating video:", error);
      },
    }
  );

  const handleCreateAllVideo = (item) => {
    setIsVideoGeneration(true);
    generateVideoApi({
      session_id: router?.query?.slug,
      episode_number: storyboardData?.[0].episode_number,
      scene_number: storyboardData?.[0]?.scene_number,
    });
  };

  const handlePrevScript = () => {
    const epIndex = selectedEpisode - 1;
    const scIndex = selectedScene - 1;

    if (scIndex > 0) {
      loadScene(epIndex, scIndex - 1);
    } else if (epIndex > 0) {
      const prevEpScenes = episodes?.[epIndex - 1]?.child?.length || 0;
      if (prevEpScenes > 0) {
        loadScene(epIndex - 1, prevEpScenes - 1);
      }
    }
  };

  const handleNextScript = () => {
    const epIndex = selectedEpisode - 1;
    const scIndex = selectedScene - 1;

    const currEp = episodes?.[epIndex];
    const totalScenes = currEp?.child?.length || 0;

    if (scIndex + 1 < totalScenes) {
      loadScene(epIndex, scIndex + 1);
    } else if (epIndex + 1 < episodes.length) {
      loadScene(epIndex + 1, 0);
    }
  };

  const loadScene = (epIndex, scIndex) => {
    const episode = episodes?.[epIndex];
    const sceneObj = episode?.child?.[scIndex];
    if (episode?.prompt && !sceneObj && !isLoading) {
      setMessage?.(episode?.prompt || "");
      sendMessage?.(episode?.prompt || "");
    }

    if (!sceneObj) return;

    setSelectedEpisode(epIndex + 1);
    setSelectedScene(scIndex + 1);

    const hasDescription = !!sceneObj?.description?.trim() || !!sceneObj?.overview?.trim();

    if (hasDescription) {
      setScriptData((sceneObj?.overview || "") + "\n\n" + (sceneObj?.description || ""));
    } else if (!isLoading) {
      setMessage?.(sceneObj?.prompt || "");
      sendMessage?.(sceneObj?.prompt || "");
    }
  };

  const isAtFirst = selectedEpisode === 1 && selectedScene === 1;

  const isAtLast = (() => {
    const lastEpIndex = episodes.length - 1;
    const lastSceneIndex = episodes?.[lastEpIndex]?.child?.length - 1;
    return selectedEpisode - 1 === lastEpIndex && selectedScene - 1 === lastSceneIndex;
  })();

  const renderContent = () => {
    switch (activeTab) {
      case "Script":
        return (
          <div
            className="flex-1 relative overflow-hidden bg-[#FFFFFF] border border-[#18181826] rounded-lg"
            style={{ height: "100%", maxHeight: "100%" }}
          >
            {currEpisode && currScene && (
              <div className="p-1">
                Selected Episode:{selectedEpisode} selected Scene:{selectedScene}
              </div>
            )}
            {!isAtFirst && (
              <button
                onClick={handlePrevScript}
                disabled={isAtFirst}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 h-[calc(100%)] px-2 group flex items-center justify-center hover:bg-black/5 transition-colors `}
              >
                <div
                  className={`w-8 h-8 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-xs  transition-colors`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </div>
              </button>
            )}

            {!isAtLast && (
              <button
                onClick={handleNextScript}
                disabled={isAtLast}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 h-[calc(100%)] px-2 group flex items-center justify-center hover:bg-black/5 transition-colors`}
              >
                <div
                  className={`w-8 h-8 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm  transition-colors`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </button>
            )}
            <div className="relative w-full h-full overflow-hidden">
              <div
                className={`absolute inset-0 w-full h-full transition-all duration-300 ease-out `}
                style={{
                  transform: `translateX(${slideOffset}%)`,
                  opacity: isTransitioning && slideOffset !== 0 ? 0.9 : 1,
                }}
              >
                <div className="p-6 overflow-auto h-full">
                  {isLoading && !scriptData ? (
                    <div className="mt-10">
                      <LoadingPreview />
                    </div>
                  ) : scriptData ? (
                    <div className="text-[#5D5D5D] min-h-full">
                      <RenderMarkdown markdown={scriptData} />
                    </div>
                  ) : (
                    <p className="text-[#5D5D5D]">No script data available yet.</p>
                  )}
                </div>
              </div>

              <div
                className={`absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-opacity duration-100 pointer-events-none ${
                  isTransitioning && slideOffset !== 0 ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  background:
                    slideOffset > 0
                      ? "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 100%)"
                      : "linear-gradient(-90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 100%)",
                }}
              />
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10 bg-white/80  px-3 py-1 ">
              {isLoading && scriptData && (
                <div className="mt-1  w-full bg-[#FFF]">
                  <LoadingMarquee calledPrompt={calledPrompt} />
                </div>
              )}
            </div>
          </div>
        );
      case "Character":
        return (
          <div className="mb-6">
            <CharacterGrid charactersData={characterData} isLoading={isLoading} />
          </div>
        );
      case "Storyboard":
        return (
          <div className="mb-10">
            <StoryboardUI
              data={storyboardData}
              isLoading={isLoading}
              handleCreateVideo={handleCreateVideo}
            />
            <button
              onClick={() => handleCreateAllVideo()}
              className="h-[40px] w-[150px] rounded-lg m-4   float-end  flex justify-center items-center"
              style={{ background: "linear-gradient(180deg, #A9A0FF -58.75%, #A0F9FF 155%)" }}
              disabled={isVideoGeneration}
            >
              {isVideoGeneration ? (
                <div className="animate-spin flex justify-center w-6 h-6 border-2 border-black border-t-transparent rounded-full" />
              ) : (
                <>Create All</>
              )}
            </button>
          </div>
        );
      case "Videos":
        return (
          <div className="mb-10">
            <StoryboardUI
              data={finalVideoData}
              isLoading={isLoading}
              handleCreateVideo={handleCreateVideo}
              isFinalVideo={true}
            />
          </div>
        );

      default:
        return (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-6">{activeTab}</h2>
            <p className="text-[5D5D5D]">Content for {activeTab} will be displayed here.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex w-[70%]">
      <div className={`${isFullWidth ? "w-[1000%]" : "w-[80%]"} flex flex-col mr-2`}>
        {/* Main Content */}
        <div className="overflow-auto h-screen  sticky scrollbar-hide">
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
            {availableTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-[150px] px-6 text-sm rounded-md shadow-md h-8 ${
                  activeTab === tab
                    ? "bg-[#181818] text-[#FFFFFF]"
                    : "bg-[#FFFFFF] text-[#5D5D5D] border border-[#D9D9D9]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div style={{ height: "90%" }}>{renderContent()}</div>
        </div>
      </div>

      {!episodes?.length == 0 && (
        <RightPanel
          currEpisode={selectedEpisode}
          currScene={selectedScene}
          episodeData={episodes}
          setScriptData={setScriptData}
          setMessage={setMessage}
          sendMessage={sendMessage}
          isLoading={isLoading}
          onSceneClick={(epIndex, scIndex) => {
            loadScene(epIndex, scIndex);
          }}
          onSceneChange={({ episode, scene, sceneObj }) => {
            console.log("🚀 ~ episode:", episode, "scene=", scene, "sceneObj", sceneObj);
          }}
        />
      )}
    </div>
  );
}
