import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

export default function StoryboardUI({ data }) {
  const [storyboardData, setStoryboardData] = useState([]);
  useEffect(() => {
    setStoryboardData(data);
  }, [data]);

  return (
    <div className=" text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Crypto Billionaire - Episode 01 - Scene 1</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {storyboardData?.map((shot, index) => (
          <div
            key={index}
            className="bg-[#242424] border border-[#464646] rounded-lg overflow-hidden"
          >
            <div className="relative h-48">
              <img src={shot?.image_url} alt={shot.name} className="h-full w-full object-cover" />
              <div className="absolute top-4 left-4 text-white text-xs font-medium">
                Shot {shot.episode_number}.{shot.shot_number}
              </div>
              <button className="absolute bottom-4 right-4 bg-black bg-opacity-50 p-2 rounded-full">
                <Pencil size={20} className="text-white" />
              </button>
            </div>

            <div className="p-4">
              <p className="text-xs text-[#D2D2D2] mb-6">{shot.description}</p>

              <div className="border-t border-gray-700 pt-2">
                <p className=" text-xs text-[#FFF]">Dialogue : {shot.dialogue}</p>
              </div>

              <div className="mt-4">
                <button className="w-full text-sm py-3 border border-[#FFFFFF] rounded-lg text-center text-white font-medium">
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
