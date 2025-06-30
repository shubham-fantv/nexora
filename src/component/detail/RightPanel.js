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
      className="overflow-auto flex flex-col bg-[#FFFFFF] border border-[#18181826] mr-4 mt-6 rounded-lg relative"
      style={{ height: "calc(100vh - 85px)" }}
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
                    ? "border-t border-l border-r border-[#6B61FF] rounded-t-xl "
                    : "rounded-xl"
                } ${isSelectedEpisode ? "bg-[#F3F5FF]" : "bg-[#F3F5FF]"}`}

                style={{ borderTopWidth: "1.5px", borderLeftWidth: "1.5px", borderRightWidth: "1.5px" }}
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
                  className={`rounded-b-xl border-l border-r border-b border-[#6B61FF] shadow-md ${
                    isSelectedEpisode ? "bg-[#F3F5FF]" : "bg-[#F3F5FF]"
                  }`}
                  style={{ borderRightWidth: "1.5px", borderBottomWidth: "1.5px",borderLeftWidth: "1.5px", }}
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
                        className={`w-full flex-1 py-2 pl-4 flex-grow flex  text-sm cursor-pointer rounded-md ${
                          isSelectedScene ? "bg-[#FFFFFF] text-black" : ""
                        }`}
                      >
                        <div className="w-full">
                          {"Scene " + (scIndex + 1)}
                          </div>
                        <div className="flex w-full justify-center items-center ">
                          {!!scene.description && (
                            <img src="/images/icons/file-tick.svg" className="h-3 w-3 " />
                          )}
                          {scene?.storyboard?.length > 0 && (
                            <img src="/images/icons/camera.svg" className="h-3 w-3 ml-2" />
                          )}
                         </div>
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
