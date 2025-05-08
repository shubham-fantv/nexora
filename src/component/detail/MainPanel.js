import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import RenderMarkdown from "../RenderMarkdown";
export function MainPanel({
  activeTab,
  setActiveTab,
  availableTabs,
  synopsisData,
  scriptData,
  characterData,
  storyboardData,
}) {
  const renderContent = () => {
    switch (activeTab) {
      case "Synopsis":
        return (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-6">Synopsis</h2>
            {synopsisData ? (
              <div className="text-gray-300">
                <RenderMarkdown markdown={synopsisData} />
              </div>
            ) : (
              <p className="text-gray-500">No synopsis data available yet.</p>
            )}
          </div>
        );
      case "Script":
        return (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-6">Script</h2>
            {scriptData ? (
              <div className="text-gray-300">
                <RenderMarkdown markdown={scriptData}></RenderMarkdown>
              </div>
            ) : (
              <p className="text-gray-500">No script data available yet.</p>
            )}
          </div>
        );
      default:
        // For custom tabs from API
        return (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-6">{activeTab}</h2>
            <p className="text-gray-500">Content for {activeTab} will be displayed here.</p>
          </div>
        );
    }
  };

  return (
    <div className="w-2/4 flex flex-col bg-black">
      {/* Tabs */}
      <div className="flex gap-2 p-4 overflow-x-auto">
        {availableTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-md ${
              activeTab === tab ? "bg-blue-200 text-gray-800" : "bg-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div
        className="overflow-auto bg-[#242424] border border-[#FFFFFF26] rounded-lg p-6 relative"
        style={{ height: "calc(100vh - 60px)", maxHeigh: "calc(100vh - 60px)" }}
      >
        {renderContent()}
      </div>
    </div>
  );
}
