import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import RenderMarkdown from "../RenderMarkdown";
import CharacterGrid from "./CharacterGrid";
import StoryboardUI from "./StoryboardUI";
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
}) {
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
              {synopsisData ? (
                <div className="text-[#5D5D5D]">
                  <RenderMarkdown markdown={synopsisData} />
                </div>
              ) : (
                <p className="text-[5D5D5D]">No synopsis data available yet.</p>
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
              {scriptData ? (
                <div className="text-[#5D5D5D]">
                  <RenderMarkdown markdown={scriptData}></RenderMarkdown>
                </div>
              ) : (
                <p className="text-[5D5D5D]">No script data available yet.</p>
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
          <div className="mb-6">
            <StoryboardUI data={storyboardData} isLoading={isLoading} />
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
