// import React, { useEffect, useState } from "react";
// import { ChevronDown } from "lucide-react";
// import { useRef } from "react";
// import RenderMarkdown from "../RenderMarkdown";
// import CharacterGrid from "./CharacterGrid";
// import StoryboardUI from "./StoryboardUI";
// import LoadingPreview from "../common/LoadingPreview";
// import fetcher from "../../dataProvider";
// import { useMutation } from "react-query";
// import { useRouter } from "next/router";
// import ScriptViewer from "../common/ScriptViewer";

// export function MainPanel({
//   activeTab,
//   setActiveTab,
//   availableTabs,
//   synopsisData,
//   characterData,
//   storyboardData,
//   isLoading,
//   isFullWidth,
//   handleCreateVideo,
//   finalVideoData,
//   setFinalVideo,
//   scriptData,
//   prevScript,
//   nextScript,
//   setScriptData,
// }) {
//   const router = useRouter();
//   const [isVideoGeneration, setIsVideoGeneration] = useState(false);
//   const [storyboardFinal, setStoryboardFinal] = useState([]);
//   const [isTransitioning, setIsTransitioning] = useState(false);

//   // Carousel state - tracks which script is currently active
//   const [currentPosition, setCurrentPosition] = useState(0); // 0 = scriptData, -1 = prevScript, 1 = nextScript
//   console.log("🚀 ~ currentPosition:", currentPosition);
//   const [slideOffset, setSlideOffset] = useState(0); // For animation offset

//   // Get the script that should be displayed based on current position
//   const getCurrentScript = () => {
//     switch (currentPosition) {
//       case -1:
//         return prevScript;
//       case 0:
//         return scriptData;
//       case 1:
//         return nextScript;
//       default:
//         return scriptData;
//     }
//   };

//   // Get available navigation options
//   const canGoPrev = () => {
//     return currentPosition === 0 ? !!prevScript : true; // Can always go prev unless we're at prevScript and no more prev
//   };

//   const canGoNext = () => {
//     return currentPosition === 0 ? !!nextScript : true; // Can always go next unless we're at nextScript and no more next
//   };
//   const { mutate: generateVideoApi } = useMutation(
//     (obj) => fetcher.post(`/merge_scene_videos`, obj),
//     {
//       onSuccess: (response) => {
//         setFinalVideo(response?.merged_videos);
//         setIsVideoGeneration(false);
//       },
//       onError: (error) => {
//         setIsVideoGeneration(false);
//         console.error("Error generating video:", error);
//       },
//     }
//   );

//   const handleCreateAllVideo = (item) => {
//     setIsVideoGeneration(true);
//     generateVideoApi({
//       session_id: router?.query?.slug,
//       episode_number: storyboardData?.[0].episode_number,
//       scene_number: storyboardData?.[0]?.scene_number,
//     });
//   };

//   const handlePrevScript = () => {
//     if (!canGoPrev() || isTransitioning) return;

//     setIsTransitioning(true);
//     setSlideOffset(100); // Slide right to show previous

//     setTimeout(() => {
//       if (currentPosition === 0) {
//         // Moving from scriptData to prevScript
//         setCurrentPosition(-1);
//       } else if (currentPosition === 1) {
//         // Moving from nextScript back to scriptData
//         setCurrentPosition(0);
//       }
//       // Reset slide offset
//       setSlideOffset(0);
//       setIsTransitioning(false);
//     }, 100);
//   };

//   const handleNextScript = () => {
//     if (!canGoNext() || isTransitioning) return;

//     setIsTransitioning(true);
//     setSlideOffset(-100); // Slide left to show next

//     setTimeout(() => {
//       if (currentPosition === 0) {
//         // Moving from scriptData to nextScript
//         setCurrentPosition(1);
//       } else if (currentPosition === -1) {
//         // Moving from prevScript back to scriptData
//         setCurrentPosition(0);
//       }
//       // Reset slide offset
//       setSlideOffset(0);
//       setIsTransitioning(false);
//     }, 100);
//   };

//   // Get content for each slide position
//   const getSlideContent = (slideType) => {
//     switch (slideType) {
//       case "left":
//         // Left slide shows the previous available script
//         if (currentPosition === 0) return prevScript;
//         if (currentPosition === 1) return scriptData;
//         if (currentPosition === -1) return null; // No more previous
//         break;
//       case "center":
//         // Center slide shows current active script
//         return getCurrentScript();
//       case "right":
//         // Right slide shows the next available script
//         if (currentPosition === 0) return nextScript;
//         if (currentPosition === -1) return scriptData;
//         if (currentPosition === 1) return null; // No more next
//         break;
//     }
//     return null;
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case "Synopsis":
//         return (
//           <div
//             className="overflow-auto bg-[#FFFFFF] border border-[#18181826] rounded-lg p-6 relative"
//             style={{ height: "calc(100vh - 60px)", maxHeigh: "calc(100vh - 60px)" }}
//           >
//             <div className="mb-6">
//               {isLoading ? (
//                 <div className="mt-10">
//                   <LoadingPreview />
//                 </div>
//               ) : synopsisData ? (
//                 <div className="text-[#5D5D5D]">
//                   <RenderMarkdown markdown={synopsisData} />
//                 </div>
//               ) : (
//                 <p className="text-[#5D5D5D]">No synopsis data available yet.</p>
//               )}
//             </div>
//           </div>
//         );
//       case "Script":
//         return (
//           <div
//             className="flex-1 relative overflow-hidden bg-[#FFFFFF] border border-[#18181826] rounded-lg"
//             style={{ height: "calc(100vh - 60px)", maxHeight: "calc(100vh - 60px)" }}
//           >
//             {/* Previous Button */}
//             <button
//               onClick={handlePrevScript}
//               className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 h-[calc(100%)] px-2 group flex items-center justify-center hover:bg-black/5 transition-colors ${
//                 !canGoPrev() || isTransitioning ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               disabled={!canGoPrev() || isTransitioning}
//             >
//               <div
//                 className={`w-12 h-12 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm ${
//                   canGoPrev() && !isTransitioning ? "group-hover:bg-black/70" : ""
//                 } transition-colors`}
//               >
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="white"
//                   strokeWidth="2"
//                   className={`${
//                     canGoPrev() && !isTransitioning ? "group-hover:scale-110" : ""
//                   } transition-transform`}
//                 >
//                   <path d="M15 18l-6-6 6-6" />
//                 </svg>
//               </div>
//             </button>

//             {/* Next Button */}
//             <button
//               onClick={handleNextScript}
//               className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 h-[calc(100%)] px-2 group flex items-center justify-center hover:bg-black/5 transition-colors ${
//                 !canGoNext() || isTransitioning ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               disabled={!canGoNext() || isTransitioning}
//             >
//               <div
//                 className={`w-12 h-12 rounded-full bg-black/10 flex items-center justify-center backdrop-blur-sm ${
//                   canGoNext() && !isTransitioning ? "group-hover:bg-black/70" : ""
//                 } transition-colors`}
//               >
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="white"
//                   strokeWidth="2"
//                   className={`${
//                     canGoNext() && !isTransitioning ? "group-hover:scale-110" : ""
//                   } transition-transform`}
//                 >
//                   <path d="M9 18l6-6-6-6" />
//                 </svg>
//               </div>
//             </button>

//             {/* Carousel Container */}
//             <div className="relative w-full h-full overflow-hidden">
//               {/* Left Slide */}
//               <div
//                 className="absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out"
//                 style={{ transform: `translateX(${-100 + slideOffset}%)` }}
//               >
//                 <div className="p-6 overflow-auto h-full">
//                   <div className="text-[#5D5D5D] min-h-full">
//                     {getSlideContent("left") && (
//                       <RenderMarkdown markdown={getSlideContent("left")} />
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Center Slide (Current) */}
//               <div
//                 className="absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out"
//                 style={{ transform: `translateX(${slideOffset}%)` }}
//               >
//                 <div className="p-6 overflow-auto h-full">
//                   {isLoading ? (
//                     <div className="mt-10">
//                       <LoadingPreview />
//                     </div>
//                   ) : getCurrentScript() ? (
//                     <div className="text-[#5D5D5D] min-h-full">
//                       <RenderMarkdown markdown={getCurrentScript()} />
//                     </div>
//                   ) : (
//                     <p className="text-[#5D5D5D]">No script data available yet.</p>
//                   )}
//                 </div>
//               </div>

//               {/* Right Slide */}
//               <div
//                 className="absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out"
//                 style={{ transform: `translateX(${100 + slideOffset}%)` }}
//               >
//                 <div className="p-6 overflow-auto h-full">
//                   <div className="text-[#5D5D5D] min-h-full">
//                     {getSlideContent("right") && (
//                       <RenderMarkdown markdown={getSlideContent("right")} />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Optional: Position Indicator */}
//             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
//               <div
//                 className={`w-2 h-2 rounded-full ${
//                   currentPosition === -1 ? "bg-black" : "bg-gray-300"
//                 }`}
//               />
//               <div
//                 className={`w-2 h-2 rounded-full ${
//                   currentPosition === 0 ? "bg-black" : "bg-gray-300"
//                 }`}
//               />
//               <div
//                 className={`w-2 h-2 rounded-full ${
//                   currentPosition === 1 ? "bg-black" : "bg-gray-300"
//                 }`}
//               />
//             </div>
//           </div>
//         );
//       case "Character":
//         return (
//           <div className="mb-6">
//             <CharacterGrid charactersData={characterData} isLoading={isLoading} />
//           </div>
//         );
//       case "Storyboard":
//         return (
//           <div className="mb-10">
//             <StoryboardUI
//               data={storyboardData}
//               isLoading={isLoading}
//               handleCreateVideo={handleCreateVideo}
//             />
//             <button
//               onClick={() => handleCreateAllVideo()}
//               className="h-[40px] w-[150px] rounded-lg m-4   float-end  flex justify-center items-center"
//               style={{ background: "linear-gradient(180deg, #A9A0FF -58.75%, #A0F9FF 155%)" }}
//               disabled={isVideoGeneration}
//             >
//               {isVideoGeneration ? (
//                 <div className="animate-spin flex justify-center w-6 h-6 border-2 border-black border-t-transparent rounded-full" />
//               ) : (
//                 <>Create All</>
//               )}
//             </button>
//           </div>
//         );
//       case "Videos":
//         return (
//           <div className="mb-10">
//             <StoryboardUI
//               data={finalVideoData}
//               isLoading={isLoading}
//               handleCreateVideo={handleCreateVideo}
//               isFinalVideo={true}
//             />
//           </div>
//         );

//       default:
//         return (
//           <div className="mb-6">
//             <h2 className="text-2xl font-bold mb-6">{activeTab}</h2>
//             <p className="text-[5D5D5D]">Content for {activeTab} will be displayed here.</p>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className={`${isFullWidth ? "w-[70%]" : "w-[60%]"} flex flex-col mr-2`}>
//       {/* Main Content */}
//       <div
//         className="overflow-auto  relative scrollbar-hide"
//         style={{ height: "calc(100vh - 60px)", maxHeigh: "calc(100vh - 60px)" }}
//       >
//         <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
//           {availableTabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`w-[150px] px-6 text-sm rounded-md shadow-md h-8 ${
//                 activeTab === tab
//                   ? "bg-[#181818] text-[#FFFFFF]"
//                   : "bg-[#FFFFFF] text-[#5D5D5D] border border-[#D9D9D9]"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//         {renderContent()}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import RenderMarkdown from "../RenderMarkdown";
import CharacterGrid from "./CharacterGrid";
import StoryboardUI from "./StoryboardUI";
import LoadingPreview from "../common/LoadingPreview";
import fetcher from "../../dataProvider";
import { useMutation } from "react-query";
import { useRouter } from "next/router";
import ScriptViewer from "../common/ScriptViewer";

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
}) {
  console.log("🚀 ~ activeTab:", activeTab, scriptData);
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

  // Get available navigation options
  const canGoPrev = () => {
    return currentPosition === 0 ? !!prevScript : true; // Can always go prev unless we're at prevScript and no more prev
  };

  const canGoNext = () => {
    return currentPosition === 0 ? !!nextScript : true; // Can always go next unless we're at nextScript and no more next
  };

  function mergeShotData(obj1 = [], obj2 = []) {
    return obj1.map((shot) => {
      const match = obj2?.find(
        (item) =>
          item.episode_number === shot.episode_number &&
          item.scene_number === shot.scene_number &&
          item.shot_number === shot.shot_number
      );

      return {
        ...shot,
        ...(match || {}),
      };
    });
  }

  const customFeatures = [
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      text: "Set custom knowledge for every edit",
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M4 7v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2z"
          />
        </svg>
      ),
      text: "Connect Supabase for backend",
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
          />
        </svg>
      ),
      text: "Collaborate at source, via GitHub",
    },
  ];

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

    // First, update position immediately so the correct content loads
    let newPosition = currentPosition;
    if (currentPosition === 0) {
      newPosition = -1; // Moving from scriptData to prevScript
    } else if (currentPosition === 1) {
      newPosition = 0; // Moving from nextScript back to scriptData
    }

    // Start with the slide coming from the left (off-screen)
    setSlideOffset(-100);
    setCurrentPosition(newPosition);

    // Immediately trigger the slide-in animation
    setTimeout(() => {
      setSlideOffset(0); // Slide into center position
    }, 10);

    // Complete the transition
    setTimeout(() => {
      setIsTransitioning(false);
    }, 350);
  };

  const handleNextScript = () => {
    if (!canGoNext() || isTransitioning) return;

    setIsTransitioning(true);

    // First, update position immediately so the correct content loads
    let newPosition = currentPosition;
    if (currentPosition === 0) {
      newPosition = 1; // Moving from scriptData to nextScript
    } else if (currentPosition === -1) {
      newPosition = 0; // Moving from prevScript back to scriptData
    }

    // Start with the slide coming from the right (off-screen)
    setSlideOffset(100);
    setCurrentPosition(newPosition);

    // Immediately trigger the slide-in animation
    setTimeout(() => {
      setSlideOffset(0); // Slide into center position
    }, 10);

    // Complete the transition
    setTimeout(() => {
      setIsTransitioning(false);
    }, 350);
  };

  // Get content for each slide position
  const getSlideContent = (slideType) => {
    switch (slideType) {
      case "left":
        // Left slide shows the previous available script
        if (currentPosition === 0) return prevScript;
        if (currentPosition === 1) return scriptData;
        if (currentPosition === -1) return null; // No more previous
        break;
      case "center":
        // Center slide shows current active script
        return getCurrentScript();
      case "right":
        // Right slide shows the next available script
        if (currentPosition === 0) return nextScript;
        if (currentPosition === -1) return scriptData;
        if (currentPosition === 1) return null; // No more next
        break;
    }
    return null;
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
            style={{ height: "calc(100vh - 60px)", maxHeight: "calc(100vh - 60px)" }}
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
                className={`w-12 h-12 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm ${
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
                className={`w-12 h-12 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm ${
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
                  {isLoading ? (
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

            {/* Optional: Position Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
              <div
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  currentPosition === -1 ? "bg-black scale-125" : "bg-gray-300"
                }`}
              />
              <div
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  currentPosition === 0 ? "bg-black scale-125" : "bg-gray-300"
                }`}
              />
              <div
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  currentPosition === 1 ? "bg-black scale-125" : "bg-gray-300"
                }`}
              />
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
      <div
        className="overflow-auto  relative scrollbar-hide"
        style={{ height: "calc(100vh - 60px)", maxHeigh: "calc(100vh - 60px)" }}
      >
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
        {renderContent()}
      </div>
    </div>
  );
}
