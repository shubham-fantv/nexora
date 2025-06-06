import React, { useEffect, useState } from "react";
import RenderMarkdown from "../RenderMarkdown";
import CharacterGrid from "./CharacterGrid";
import StoryboardUI from "./StoryboardUI";
import LoadingPreview from "../common/LoadingPreview";
import fetcher from "../../dataProvider";
import { useMutation } from "react-query";
import { useRouter } from "next/router";
import LoadingMarquee from "../common/LoadingMarquee";

export function MainPanel({
  activeTab,
  setActiveTab,
  availableTabs,
  synopsisData,
  characterData,
  storyboardData,
  isLoading,
  isFullWidth,
  handleCreateVideo,
  finalVideoData,
  setFinalVideo,
  scriptData,
  prevScript,
  nextScript,
  setScriptData,
  handleLoadMore,
}) {
  const router = useRouter();
  const [isVideoGeneration, setIsVideoGeneration] = useState(false);
  const [storyboardFinal, setStoryboardFinal] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Carousel state - tracks which script is currently active
  const [currentPosition, setCurrentPosition] = useState(0); // 0 = scriptData, -1 = prevScript, 1 = nextScript
  const [slideOffset, setSlideOffset] = useState(0); // For animation offset

  // Get the script that should be displayed based on current position
  const getCurrentScript = () => {
    switch (currentPosition) {
      case -1:
        return prevScript;
      case 0:
        return scriptData;
      case 1:
        return nextScript;
      default:
        return scriptData;
    }
  };

  const canGoPrev = () => {
    return currentPosition === 0 ? !!prevScript : true; // Can always go prev unless we're at prevScript and no more prev
  };

  const canGoNext = () => {
    return currentPosition === 0 ? !!nextScript : true; // Can always go next unless we're at nextScript and no more next
  };
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
    if (!canGoPrev() || isTransitioning) return;
    setIsTransitioning(true);

    let newPosition = currentPosition;
    if (currentPosition === 0) {
      newPosition = -1;
    } else if (currentPosition === 1) {
      newPosition = 0;
    } else {
      handleLoadMore("previous");
    }

    setSlideOffset(-500);
    setCurrentPosition(newPosition);

    setTimeout(() => {
      setSlideOffset(0);
    }, 10);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 350);
  };

  const handleNextScript = () => {
    if (!canGoNext() || isTransitioning) return;
    setIsTransitioning(true);
    let newPosition = currentPosition;
    if (currentPosition === 0) {
      newPosition = 1;
    } else if (currentPosition === -1) {
      newPosition = 0;
    } else {
      handleLoadMore("next");
    }
    setSlideOffset(100);
    setCurrentPosition(newPosition);

    setTimeout(() => {
      setSlideOffset(0);
    }, 10);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 350);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Synopsis":
        return (
          <div
            className="overflow-auto bg-[#FFFFFF] border border-[#18181826] rounded-lg p-6 relative"
            style={{ height: "calc(100vh - 60px)", maxHeigh: "calc(100vh - 60px)" }}
          >
            <div className="mb-6">
              {isLoading ? (
                <div className="mt-10">
                  <LoadingPreview />
                </div>
              ) : synopsisData ? (
                <div className="text-[#5D5D5D]">
                  <RenderMarkdown markdown={synopsisData} />
                </div>
              ) : (
                <p className="text-[#5D5D5D]">No synopsis data available yet.</p>
              )}
            </div>
          </div>
        );
      case "Script":
        return (
          <div
            className="flex-1 relative overflow-hidden bg-[#FFFFFF] border border-[#18181826] rounded-lg"
            style={{ height: "100%", maxHeight: "100%" }}
          >
            {/* Previous Button */}
            <button
              onClick={handlePrevScript}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 h-[calc(100%)] px-2 group flex items-center justify-center hover:bg-black/5 transition-colors ${
                !canGoPrev() || isTransitioning ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!canGoPrev() || isTransitioning}
            >
              <div
                className={`w-8 h-8 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-xs ${
                  canGoPrev() && !isTransitioning ? "group-hover:bg-black/70" : ""
                } transition-colors`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  className={`${
                    canGoPrev() && !isTransitioning ? "group-hover:scale-110" : ""
                  } transition-transform`}
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </div>
            </button>
            {/* Next Button */}
            <button
              onClick={handleNextScript}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 h-[calc(100%)] px-2 group flex items-center justify-center hover:bg-black/5 transition-colors ${
                !canGoNext() || isTransitioning ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!canGoNext() || isTransitioning}
            >
              <div
                className={`w-8 h-8 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm ${
                  canGoNext() && !isTransitioning ? "group-hover:bg-black/70" : ""
                } transition-colors`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  className={`${
                    canGoNext() && !isTransitioning ? "group-hover:scale-110" : ""
                  } transition-transform`}
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </button>
            {/* Carousel Container */}
            <div className="relative w-full h-full overflow-hidden">
              {/* Current Content Slide */}
              <div
                className={`absolute inset-0 w-full h-full transition-all duration-300 ease-out ${
                  isTransitioning ? "transform" : ""
                }`}
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
                  ) : getCurrentScript() ? (
                    <div className="text-[#5D5D5D] min-h-full">
                      <RenderMarkdown markdown={getCurrentScript()} />
                    </div>
                  ) : (
                    <p className="text-[#5D5D5D]">No script data available yet.</p>
                  )}
                </div>
              </div>

              {/* Slide Transition Overlay */}
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
                  <LoadingMarquee />
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
    <div className={`${isFullWidth ? "w-[70%]" : "w-[60%]"} flex flex-col mr-2`}>
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
  );
}
