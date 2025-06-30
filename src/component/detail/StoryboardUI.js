import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useMutation } from "react-query";
import fetcher from "../../dataProvider";
import { useRouter } from "next/router";
import RenderMarkdown from "../RenderMarkdown";

export default function StoryboardUI({ data, isLoading, isFinalVideo = false }) {
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState();
  const [isVideoGeneration, setIsVideoGeneration] = useState(false);
  const [storyboardData, setStoryboardData] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    setStoryboardData(data);
  }, [data]);

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
        ...(match || {}), // merge if found
      };
    });
  }

  const { mutate: generateVideoApi } = useMutation((obj) => fetcher.post(`/generate_videos`, obj), {
    onSuccess: (response) => {
      let mergerData = mergeShotData(storyboardData, response?.video_clips);
      setStoryboardData(mergerData);
      setIsVideoGeneration(false);
    },
    onError: (error) => {
      setIsVideoGeneration(false);
      console.error("Error generating video:", error);
    },
  });

  const handleCreateVideo = (item) => {
    setSelectedVideo(item);
    setIsVideoGeneration(true);
    generateVideoApi({
      session_id: router?.query?.slug,
      episode_number: item?.episode_number,
      scene_number: item?.scene_number,
      shot_number: item?.shot_number,
    });
  };
  return (
    <div className=" text-[#5D5D5D] min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {storyboardData.length > 0 &&
          storyboardData?.map((shot, index) => (
            <div
              key={index}
              className="bg-white border border-[#D6D6D6] rounded-lg overflow-hidden flex flex-col"
            >
              <div className="relative h-48">
                {shot?.remote_url ? (
                  <video
                    src={shot?.remote_url}
                    muted
                    loop
                    controls
                    poster={shot?.imageUrl}
                    playsInline
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => e.target.pause()}
                    onEnded={(e) => e.target.play()}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={shot?.image_url}
                    alt={shot.name}
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute top-4 text-[#FFF] left-4 text-xs font-medium">
                  Shot {shot.scene_number}.{shot.shot_number}
                </div>
                <button className="absolute top-4 right-4 bg-[#242424]  p-2 rounded">
                  <img src="/images/edit.svg" style={{ height: "16px", width: "16px" }} />
                </button>
              </div>

              {!isFinalVideo && (
                <div className="flex flex-col flex-1 p-4">
                  <p className={`text-xs mb-3 ${expandedIndex === index ? "" : "line-clamp-2"}`}>
                    <RenderMarkdown markdown={shot?.description} />
                  </p>
                  {expandedIndex !== index && (
                    <span
                      className="text-[#6B61FF] cursor-pointer text-sm"
                      onClick={() => setExpandedIndex(index)}
                    >
                      Show more . . .
                    </span>
                  )}
                  {expandedIndex === index && (
                    <span
                      className="text-[#6B61FF] cursor-pointer text-sm"
                      onClick={() => setExpandedIndex(null)}
                    >
                      Show less
                    </span>
                  )}

                  <div
                    style={{
                      background:
                        "linear-gradient(270deg, rgba(160, 249, 255, 0.4) 0%, rgba(169, 160, 255, 0.4) 100%)",
                      height: "1.5px",
                    }}
                  ></div>
                  <div className="py-2">
                    <p className="text-xs">
                      Dialogue: <RenderMarkdown markdown={shot?.dialogue} />
                    </p>
                  </div>

                  {/* Spacer to push the button to the bottom */}
                  <div className="mt-auto">
                    <button
                      onClick={() => handleCreateVideo(shot)}
                      disabled={isVideoGeneration}
                      className="w-full text-sm py-3 border-2 border-[#181818] flex justify-center  text-[#181818] rounded-lg text-center font-medium"
                    >
                      {isVideoGeneration && selectedVideo.created_at == shot.created_at ? (
                        <div className="animate-spin flex justify-center w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                      ) : (
                        <>Create</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
