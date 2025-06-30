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
import ShimmerCard from "../Shimmer/StoryboardShimmer";
import { BookOpen, User, LayoutDashboard } from "lucide-react";

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
  const [preventToNextEpisode, setPreventToNextEpisode] = useState();
  const [preventToNextScene, setPreventToNextScene] = useState();
  const [calledApiForTab, setCalledApiForTab] = useState("Script");

  const [selectedEpisode, setSelectedEpisode] = useState(currEpisode > 0 ? currEpisode : null);
  const [selectedScene, setSelectedScene] = useState(currScene > 0 ? currScene : null);

  useEffect(() => {
    setSelectedEpisode(currEpisode > 0 ? currEpisode : null);
    setSelectedScene(currScene > 0 ? currScene : null);
  }, [currScene, currEpisode]);

  useEffect(() => {
    setCalledApiForTab(activeTab);
  }, [activeTab]);

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
      episode_number: selectedEpisode,
      scene_number: selectedScene,
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

    let currEp = episodes?.[epIndex];
    let totalScenes = currEp?.child?.length || 0;

    if (scIndex + 1 < totalScenes) {
      loadScene(epIndex, scIndex + 1);
    } else if (epIndex + 1 < episodes.length) {
      loadScene(epIndex + 1, 0);
    }
  };

  const loadScene = (epIndex, scIndex) => {
    const episode = episodes?.[epIndex];
    const sceneObj = episode?.child?.[scIndex];
    const storyboard = sceneObj?.storyboard;
    if (activeTab == "Script") {
      setCalledApiForTab("Script");
      if (episode?.prompt && !sceneObj && !isLoading) {
        setMessage?.(episode?.prompt || "");
        sendMessage?.(episode?.prompt || "");
        setPreventToNextEpisode(epIndex);
        setPreventToNextScene(scIndex);
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
        setPreventToNextEpisode(epIndex);
        setPreventToNextScene(scIndex);
      }
    }

    if (activeTab == "Storyboard") {
      setCalledApiForTab("Storyboard");
      if (storyboard?.length == 0 && !isLoading) {
        setMessage?.(sceneObj?.storyboard_prompt || "");
        sendMessage?.(sceneObj?.storyboard_prompt || "");
        setPreventToNextEpisode(epIndex);
        setPreventToNextScene(scIndex);
      }
      if (!sceneObj) return;
      setSelectedEpisode(epIndex + 1);
      setSelectedScene(scIndex + 1);
    }
  };

  const isAtFirst = selectedEpisode === null && selectedScene === null;
  const isAtLast = (() => {
    if (!Array.isArray(episodes) || episodes?.length === 0) return true;

    const lastEpIndex = episodes.length - 1;
    const lastEpisode = episodes[lastEpIndex];
    const lastSceneIndex = Array.isArray(lastEpisode?.child) ? lastEpisode.child.length - 1 : -1;

    if (lastSceneIndex < 0) return false;

    return selectedEpisode - 1 === lastEpIndex && selectedScene - 1 === lastSceneIndex;
  })();

  const renderContent = () => {
    switch (activeTab) {
      case "Script":
        return (
          <div
            className="flex-1 relative overflow-hidden"
            style={{ height: "100%", maxHeight: "100%" }}
          >
            {!isAtFirst && (
              <button
                onClick={handlePrevScript}
                disabled={isAtFirst}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 h-[calc(100%)] px-2 group flex items-center justify-center hover:bg-black/15 transition-colors `}
              >
                <div
                  className={`w-8 h-8 rounded-full bg-black/10 hover:bg-black/50 flex items-center justify-center   transition-colors`}
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
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 h-[calc(100%)] px-2 group flex items-center justify-center hover:bg-black/15 transition-colors`}
              >
                <div
                  className={`w-8 h-8 rounded-full bg-black/10 hover:bg-black/50 flex items-center justify-center backdrop-blur-sm  transition-colors`}
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
                <div className="px-4 pb-6 pt-3 overflow-auto h-full">
                  {isLoading && !scriptData ? (
                    <div className="mt-10">
                      <LoadingPreview />
                    </div>
                  ) : scriptData ? (
                    <div className="text-[#5D5D5D] min-h-full">
                      <RenderMarkdown markdown={scriptData} />
                      <div>
                        {isLoading && calledApiForTab == "Script" ? (
                          selectedEpisode - 1 === preventToNextEpisode &&
                          selectedScene - 1 === preventToNextScene ? (
                            <p  className="flex bg-[#F3F5FF] text-sm w-full text-[#6B61FF] justify-between p-3 rounded-lg">
                              <p> Scene shots being generated...</p>
                              <div className="animate-spin w-6 h-6 border-2 border-[#6B61FF]  border-t-transparent rounded-full" />
                            </p>
                          ) : (
                            <p className="flex justify-center pt-10">
                              Please wait others scene shots being generated...
                            </p>
                          )
                        ) : null}
                      </div>
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
            {/* {activeTab == "Script" && calledApiForTab == "Script" && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10 bg-white/80  px-3 py-1 ">
                {isLoading && scriptData && (
                  <div className="mt-1  w-full bg-[#FFF]">
                    <LoadingMarquee calledPrompt={calledPrompt} />
                  </div>
                )}
              </div>
            )} */}
          </div>
        );
      case "Character":
        return (
          <div
            className="flex-1 relative overflow-hidden"
            style={{ height: "100%", maxHeight: "100%" }}
          >
            <div className="mb-6">
              <CharacterGrid charactersData={characterData} isLoading={isLoading} />
            </div>
          </div>
        );
      case "Storyboard":
        return (
          <div
            className="flex-1 relative overflow-hidden"
            style={{ height: "100%", maxHeight: "100%" }}
          >
            {/* {currEpisode && currScene && ( */}
            <div className="flex justify-between">

              <div className="px-6 pt-2">
                <RenderMarkdown
                  markdown={
                    episodes[selectedEpisode-1]?.title +
                    "\n " +
                    episodes?.[selectedEpisode - 1]?.child[selectedScene - 1]?.title
                  }
                />
              </div>
              <div>
              {episodes?.[selectedEpisode - 1]?.child?.[selectedScene - 1]?.storyboard?.length >
                    0 && (
                    <button
                      onClick={() => handleCreateAllVideo()}
                      className="h-[40px] text-white text-sm w-[110px] rounded-lg m-4  mb-4  float-end  flex justify-center items-center"
                      style={{
                        background: "#6B61FF",
                      }}
                      disabled={isVideoGeneration}
                    >
                      {isVideoGeneration ? (
                        <div className="animate-spin flex justify-center w-6 h-6 border-2 border-black  border-t-transparent rounded-full" />
                      ) : (
                        <>Create All</>
                      )}
                    </button>
                  )}
              </div>
            </div>


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
                <div className="px-4 pb-20 overflow-auto h-full">
                  {isLoading &&
                  calledApiForTab == "Storyboard" &&
                  selectedEpisode - 1 == preventToNextEpisode &&
                  selectedScene - 1 === preventToNextScene ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                      {[1, 2, 3, 4, 5, 6].map(() => (
                        <ShimmerCard className="shadow-lg" />
                      ))}
                    </div>
                  ) : episodes?.[selectedEpisode - 1]?.child?.[selectedScene - 1]?.storyboard
                      ?.length > 0 ? (
                    <div className="text-[#5D5D5D] ">
                      <StoryboardUI
                        data={
                          episodes?.[selectedEpisode - 1]?.child?.[selectedScene - 1]?.storyboard ||
                          []
                        }
                        isLoading={isLoading}
                        handleCreateVideo={handleCreateVideo}
                      />
                    </div>
                  ) : isLoading ? (
                    <p className="text-[#5D5D5D] justify-center pt-10 flex align-center  h-full m-auto">
                      Please wait while executing other script
                    </p>
                  ) : (
                    <p className="text-[#5D5D5D] justify-center pt-10 flex align-center  h-full m-auto">
                      No Storyboard created, click on scene to generate Storyboard
                    </p>
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
            {/* {activeTab == "Storyboard" && calledApiForTab == "Storyboard" && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10 bg-white/80  px-3 py-1 ">
                {isLoading &&
                  episodes?.[selectedEpisode - 1]?.child?.[selectedScene - 1]?.storyboard?.length ==
                    0 && (
                    <div className="mt-1  w-full bg-[#FFF]">
                      <LoadingMarquee calledPrompt={calledPrompt} />
                    </div>
                  )}
              </div>
            )} */}
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
      <div className={`${isFullWidth ? "w-[1000%]" : "w-[80%]"} flex flex-col mr-4`}>
        <div className="overflow-auto h-screen  sticky scrollbar-hide">
          <div className="flex">
            <div className="flex item bg-white rounded-full border border-[#E5E5EF] shadow py-2 px-4 h-12 mt-6 mb-4">
              {availableTabs.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={`flex text-sm items-center gap-2 px-6 py-1.5 rounded-full transition-all duration-200 ${
                    activeTab === tab.label
                      ? "text-white font-semibold"
                      : "bg-transparent text-[#5D5D5D] font-normal"
                  }`}
                  style={
                    activeTab === tab.label
                      ? {
                          background: 'linear-gradient(180deg, #6B61FF -28.12%, #FFA0FF 128.13%)',
                          // border: '1px solid #BDBDBD',
                          boxShadow: '0px 1px 7px 0px #0000001F',
                        }
                      : {}
                  }
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div
            style={{
              height: "86%",
              padding: "1.5px", // thickness of the border
              borderRadius: "20px", // match your design
              overflow:"hidden",
              background: "linear-gradient(180deg, #6B61FF 0%, #FFA0FF 100%)", // or your desired gradient
            }}
          >
            <div
              style={{
                height: "100%",
                width: "100%",
                background: "#fff",
                borderRadius: "20px", // slightly less than outer for the border to show
              }}
            >
              {renderContent()}
            </div>
          </div>
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
          setPreventToNextEpisode={setPreventToNextEpisode}
          setPreventToNextScene={setPreventToNextScene}
          setCalledApiForTab={setCalledApiForTab}
          activeTab={activeTab}
          onSceneClick={(epIndex, scIndex) => {
            loadScene(epIndex, scIndex);
          }}
          onSceneChange={({ episode, scene, sceneObj }) => {
            // console.log("🚀 ~ episode:", episode, "scene=", scene, "sceneObj", sceneObj);
          }}
        />
      )}
    </div>
  );
}

{
  /* <div className="mb-10 overflow-auto ">
  <StoryboardUI data={storyboardData} isLoading={isLoading} handleCreateVideo={handleCreateVideo} />
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
</div>; */
}
