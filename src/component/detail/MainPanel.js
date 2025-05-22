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
export function MainPanel({
  activeTab,
  setActiveTab,
  availableTabs,
  synopsisData,
  scriptData,
  characterData,
  storyboardData,
  isLoading,
  isFullWidth,
  handleCreateVideo,
  finalVideoData,
  setFinalVideo,
}) {
  const router = useRouter();
  const [isVideoGeneration, setIsVideoGeneration] = useState(false);
  const [storyboardFinal, setStoryboardFinal] = useState([]);

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

  const renderContent = () => {
    switch (activeTab) {
      case "Synopsis":
        return (
          <div
            className="overflow-auto bg-[#FFFFFF] border border-[#18181826] rounded-lg p-6 relative"
            style={{ height: "calc(100vh - 60px)", maxHeigh: "calc(100vh - 60px)" }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-6">Synopsis</h2>

              {isLoading ? (
                <LoadingPreview features={customFeatures} />
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
            className="overflow-auto bg-[#FFFFFF] border border-[#18181826] rounded-lg p-6 relative"
            style={{ height: "calc(100vh - 60px)", maxHeigh: "calc(100vh - 60px)" }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-6">Script</h2>

              {isLoading ? (
                <LoadingPreview features={customFeatures} />
              ) : scriptData ? (
                <div className="text-[#5D5D5D]">
                  <RenderMarkdown markdown={scriptData} />
                </div>
              ) : (
                <p className="text-[#5D5D5D]">No script data available yet.</p>
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
      {/* Tabs */}
      <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
        {availableTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={` w-[150px] px-6 text-sm  rounded-md shadow-md  h-8 ${
              activeTab === tab
                ? "bg-[#181818] text-[#FFFFFF]"
                : "bg-[#FFFFFF] text-[#5D5D5D] border border-[#D9D9D9]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div
        className="overflow-auto  relative scrollbar-hide"
        style={{ height: "calc(100vh - 60px)", maxHeigh: "calc(100vh - 60px)" }}
      >
        {renderContent()}
      </div>
    </div>
  );
}
