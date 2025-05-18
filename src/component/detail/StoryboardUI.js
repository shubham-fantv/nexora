import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

export default function StoryboardUI({ data, isLoading }) {
  console.log("🚀 ~ StoryboardUI ~ isLoading:", data, isLoading);
  const [storyboardData, setStoryboardData] = useState([]);
  useEffect(() => {
    setStoryboardData(data);
  }, [data]);

  return (
    <div className=" text-[#5D5D5D] min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {storyboardData?.map((shot, index) => (
          <div
            key={index}
            className="bg-white border border-[#D6D6D6] rounded-lg overflow-hidden flex flex-col"
          >
            <div className="relative h-48">
              <img src={shot?.image_url} alt={shot.name} className="h-full w-full object-cover" />
              <div className="absolute top-4 left-4 text-xs font-medium">
                Shot {shot.episode_number}.{shot.shot_number}
              </div>
              <button className="absolute bottom-4 right-4 bg-[#242424]  p-2 rounded">
                <img src="/images/edit.svg" style={{ height: "16px", width: "16px" }} />
              </button>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-1 p-4">
              <p className="text-xs mb-6">{shot.description}</p>

              <div
                style={{
                  background:
                    "linear-gradient(270deg, rgba(160, 249, 255, 0.4) 0%, rgba(169, 160, 255, 0.4) 100%)",
                  height: "1.5px",
                }}
              ></div>
              <div className="py-2">
                <p className="text-xs">Dialogue: {shot.dialogue}</p>
              </div>

              {/* Spacer to push the button to the bottom */}
              <div className="mt-auto">
                <button className="w-full text-sm py-3 border-2 border-[#181818] text-[#181818] rounded-lg text-center font-medium">
                  Create
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
