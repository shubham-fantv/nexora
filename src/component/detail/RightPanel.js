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
        if (prev.includes(episode.title)) {
          return prev.filter((id) => id !== episode.title);
        } else {
          return [...prev, episode.title];
        }
      });
    }
  };

  return (
    <div
      className="overflow-auto flex bg-[#FFFFFF] border border-[#18181826] mr-4 mt-4 rounded-lg relative"
      style={{ height: "calc(100vh - 80px)", maxHeigh: "calc(100vh - 80px)" }}
    >
      <div className="w-[170px] rounded-lg  p-4 text-[#5D5D5D]">
        {episodes?.length == 0 && <div>Episodes will came here</div>}
        {episodes?.map((episode, idx) => (
          <div key={episode.title} className="mb-4">
            <button
              onClick={() => handleToggleEpisode(episode)}
              className={`w-full shadow-md flex items-center justify-between p-3   bg-[#F3F3F3] ${
                openEpisodes.includes(episode.title)
                  ? " border-t border-l border-r border-[#181818]  rounded-t-xl "
                  : "rounded-xl"
              }`}
            >
              <span className="text-sm font-medium">{`Episode ${String(idx + 1).padStart(
                2,
                "0"
              )}`}</span>
              {episode.child && episode.child.length > 0 && (
                <ChevronDown
                  size={24}
                  className={`transition-transform ${
                    openEpisodes.includes(episode.title) ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {openEpisodes.includes(episode.title) && episode.child && episode.child.length > 0 && (
              <div className=" px-3 rounded-b-xl bg-[#F3F3F3] border-l border-r border-b border-[#181818] shadow-md">
                {episode.child.map((scene, index) => (
                  <div
                    onClick={() => setMessage(scene.prompt)}
                    key={index}
                    className="py-2 text-sm  cursor-pointer"
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
