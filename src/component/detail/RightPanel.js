import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import RenderMarkdown from "../RenderMarkdown";
export function RightPanel() {
  const episodes = Array.from({ length: 9 }, (_, i) => `Episode ${String(i + 1).padStart(2, "0")}`);
  const [expandedEpisode, setExpandedEpisode] = useState(null);

  return (
    <div className="w-1/5 p-4 bg-black">
      <div className="bg-[#242424] border border-[#FFFFFF26] rounded-lg p-2 flex flex-col gap-2 h-full">
        <div className="border border-[#FFFFFF40] rounded-md p-3 mb-2 flex items-center justify-between">
          <span>Episode 01</span>
        </div>

        {episodes.slice(1).map((episode) => (
          <div
            key={episode}
            className="border border-[#FFFFFF26] rounded-md p-3 flex items-center justify-between cursor-pointer"
          >
            <span>{episode}</span>
            <ChevronDown
              size={20}
              className={`transition-transform ${expandedEpisode === episode ? "rotate-180" : ""}`}
              onClick={() => setExpandedEpisode(episode === expandedEpisode ? null : episode)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
