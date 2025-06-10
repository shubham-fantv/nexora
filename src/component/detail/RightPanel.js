import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export function RightPanel({
  setMessage,
  episodeData,
  sendMessage,
  currEpisode,
  currScene,
  setScriptData,
  onSceneChange,
  onSceneClick,
  isLoading,
  setPreventToNextEpisode,
  setPreventToNextScene,
  setCalledApiForTab,
  activeTab,
}) {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(
    currEpisode > 0 ? currEpisode - 1 : null
  );
  const [currentSceneIndex, setCurrentSceneIndex] = useState(currScene > 0 ? currScene - 1 : null);

  useEffect(() => {
    setCurrentEpisodeIndex(currEpisode > 0 ? currEpisode - 1 : null);
    setCurrentSceneIndex(currScene > 0 ? currScene - 1 : null);
    setOpenEpisodes([currEpisode > 0 ? currEpisode - 1 : null]);
  }, [currScene, currEpisode]);

  const [episodes, setEpisodes] = useState([]);
  const [openEpisodes, setOpenEpisodes] = useState([0]);

  useEffect(() => {
    setEpisodes(episodeData || []);
  }, [episodeData]);

  const selectedEpisode = episodes[currentEpisodeIndex] || null;
  const selectedScene = selectedEpisode?.child?.[currentSceneIndex] || null;

  useEffect(() => {
    if (selectedScene) {
      if (currentSceneIndex == 0) {
        setScriptData(
          (selectedEpisode?.title || "") +
            "\n\n" +
            (selectedEpisode?.overview || "") +
            "\n\n" +
            (selectedScene?.title || "") +
            "\n\n" +
            (selectedScene?.overview || "") +
            "\n\n" +
            (selectedScene?.description || "")
        );
      } else {
        setScriptData(
          (selectedEpisode?.title || "") +
            "\n\n" +
            (selectedScene?.title || "") +
            "\n\n" +
            (selectedScene?.overview || "") +
            "\n\n" +
            (selectedScene?.description || "")
        );
      }
      if (selectedScene?.description == "" && !isLoading) {
        setPreventToNextScene(currentSceneIndex);
        setPreventToNextEpisode(currentEpisodeIndex);
        setCalledApiForTab(activeTab);
        setMessage?.(selectedScene.prompt || "");
        sendMessage?.(selectedScene.prompt || "");
      }
      onSceneChange?.({
        episode: currentEpisodeIndex + 1,
        scene: currentSceneIndex + 1,
        sceneObj: selectedScene,
      });
    } else if (selectedEpisode) {
      if (episodeData?.[currentEpisodeIndex]?.description) {
        setScriptData(selectedEpisode?.description || "");
      } else {
        setScriptData(
          (selectedEpisode?.title || "") +
            "\n\n" +
            (selectedEpisode?.overview || "") +
            "\n\n" +
            (selectedEpisode?.description || "")
        );
      }
      if (
        (selectedEpisode?.child?.length == 0 && !isLoading) ||
        (!selectedEpisode?.description && !isLoading)
      ) {
        setPreventToNextScene(currentSceneIndex);
        setPreventToNextEpisode(currentEpisodeIndex);
        setMessage?.(selectedEpisode.prompt || "");
        sendMessage?.(selectedEpisode.prompt || "");
        setCalledApiForTab(activeTab);
      }
    }
  }, [currentEpisodeIndex, currentSceneIndex, episodeData]);

  const handleToggleEpisode = (episodeIndex) => {
    setCurrentEpisodeIndex(episodeIndex);
    setCurrentSceneIndex(null);
    setOpenEpisodes([episodeIndex]);
  };
  return (
    <div
      className="overflow-auto flex flex-col bg-[#FFFFFF] border border-[#18181826] mr-4 mt-12 rounded-lg relative"
      style={{ height: "calc(100vh - 120px)" }}
    >
      <div className="w-[170px] p-4 text-[#5D5D5D]">
        {episodes.length === 0 && <div>Episodes will come here</div>}
        {episodes.map((episode, epIndex) => {
          const isSelectedEpisode = epIndex === currentEpisodeIndex;
          return (
            <div key={epIndex} className="mb-4">
              <button
                onClick={() => handleToggleEpisode(epIndex)}
                className={`w-full shadow-md flex items-center justify-evenly p-3 ${
                  openEpisodes.includes(epIndex)
                    ? "border-t border-l border-r border-[#181818] rounded-t-xl"
                    : "rounded-xl"
                } ${isSelectedEpisode ? "bg-[#C7E8FF]" : "bg-[#F3F3F3]"}`}
              >
                <span className="text-sm font-medium">{`Episode ${String(epIndex + 1).padStart(
                  2,
                  "0"
                )}`}</span>
                {episode.child?.length > 0 && (
                  <ChevronDown
                    size={24}
                    className={`transition-transform ${
                      openEpisodes.includes(epIndex) ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {openEpisodes.includes(epIndex) && episode.child?.length > 0 && (
                <div
                  className={`px-3 rounded-b-xl border-l border-r border-b border-[#181818] shadow-md ${
                    isSelectedEpisode ? "bg-[#E6F4FF]" : "bg-[#F3F3F3]"
                  }`}
                >
                  {episode.child.map((scene, scIndex) => {
                    const isSelectedScene = isSelectedEpisode && scIndex === currentSceneIndex;
                    return (
                      <div
                        onClick={() => {
                          setCurrentEpisodeIndex(epIndex);
                          setCurrentSceneIndex(scIndex);
                          onSceneClick?.(epIndex, scIndex);
                        }}
                        key={scIndex}
                        className={`py-2 flex  text-sm cursor-pointer rounded-md px-1 ${
                          isSelectedScene ? "bg-[#A0D8FF] font-semibold text-black" : ""
                        }`}
                      >
                        {"Scene " + (scIndex + 1)}
                        {!!scene.description && (
                          <img src="/images/icons/file-tick.svg" className="h-4 w-4 ml-1 " />
                        )}
                        {scene?.storyboard?.length > 0 && (
                          <img src="/images/icons/camera.svg" className="h-4 w-4 ml-2" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
