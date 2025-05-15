import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export function RightPanel({ setMessage, episodeData }) {
  const [episodes, setEpisodes] = useState([]);
  useEffect(() => {
    setEpisodes(episodeData || []);
  }, [episodeData]);

  const [openEpisodes, setOpenEpisodes] = useState(["Episode 01"]);

  const handleToggleEpisode = (episode) => {
    setMessage(episode?.prompt);
    if (episode.child && episode.child.length > 0) {
      setOpenEpisodes((prev) => {
        if (prev.includes(episode.id)) {
          return prev.filter((id) => id !== episode.id);
        } else {
          return [...prev, episode.id];
        }
      });
    }
  };

  return (
    <div
      className="overflow-auto flex bg-[#242424] mx-4 mt-4 rounded-lg relative"
      style={{ height: "calc(100vh - 60px)", maxHeigh: "calc(100vh - 60px)" }}
    >
      <div className="w-64 rounded-lg  p-4 text-white">
        {episodes?.length == 0 && <div>Episodes will came here</div>}
        {episodes?.map((episode, idx) => (
          <div key={episode.id} className="mb-2">
            <button
              onClick={() => handleToggleEpisode(episode)}
              className={`w-full flex items-center justify-between p-3 rounded-md ${
                openEpisodes.includes(episode.id)
                  ? "bg-gray-800 border border-teal-500/30"
                  : "bg-gray-700 "
              }`}
            >
              <span className="text-sm font-medium">{`Episode ${String(idx + 1).padStart(
                2,
                "0"
              )}`}</span>
              {episode.child && episode.child.length > 0 && (
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    openEpisodes.includes(episode.id) ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {openEpisodes.includes(episode.id) && episode.child && episode.child.length > 0 && (
              <div className=" p-2 rounded-md bg-gray-800 border border-teal-500/30">
                {episode.child.map((scene, index) => (
                  <div
                    onClick={() => setMessage(scene.prompt)}
                    key={index}
                    className="py-2 text-sm text-[#D2D2D2] cursor-pointer"
                  >
                    {"Scene " + (index + 1)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
