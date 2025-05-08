// import React, { useState } from "react";
// import { PlusIcon } from "lucide-react";
// import { useRouter } from "next/router";

// export default function VideoCreationUI() {
//   const [prompt, setPrompt] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("Short Drama");

//   const router = useRouter();
//   const categories = [
//     { id: "short-drama", name: "Short Drama", icon: <PlusIcon size={16} /> },
//     { id: "web-series", name: "Web Series", icon: null },
//     { id: "music-videos", name: "Music Videos", icon: null },
//   ];

//   const templates = [
//     {
//       id: "rags-to-riches",
//       title: "Rags to Riches",
//       description: "Create a story of Crypto Billionaire - a rags to riches story...",
//     },
//     {
//       id: "love-story",
//       title: "Love Story",
//       description: "Create a love story of a college student who hates his classmate...",
//     },
//     {
//       id: "hidden-identity",
//       title: "Hidden Identity",
//       description: "Create a story of Crypto Billionaire - a rags to riches story.........",
//     },
//   ];

//   return (
//     <div className="flex items-center justify-center ">
//       <div className="w-full max-w-[760px] mt-10">
//         <div className="flex flex-col items-center mb-8">
//           <h1 className="text-3xl font-semibold text-white mb-3">Lets make the video together!</h1>
//           <p className="text-gray-400">Just a prompt away.</p>
//         </div>

//         <div className=" border border-[#FFFFFF26] rounded-lg p-6 mb-6">
//           <textarea
//             rows={3}
//             type="text"
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//             placeholder="Give your prompts here..."
//             className="w-full bg-transparent text-gray-300 outline-none mb-6"
//           />
//           <div className="flex justify-between">
//             <div className="flex gap-4">
//               {categories.map((category) => (
//                 <button
//                   key={category.id}
//                   onClick={() => setSelectedCategory(category.name)}
//                   className={`flex items-center gap-2 py-2 px-4 rounded-md ${
//                     selectedCategory === category.name ? "bg-[#353535]" : "bg-[#353535]"
//                   }`}
//                 >
//                   {category.icon}
//                   <span className="text-[#D2D2D2] text-sm">{category.name}</span>
//                 </button>
//               ))}
//             </div>
//             <div onClick={() => router.push("/generate")}>
//               <img src="/images/submit.svg" />
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {templates.map((template) => (
//             <div key={template.id} className="border border-[#FFFFFF26]  rounded-lg p-4">
//               <h3 className="text-white mb-2">{template.title}</h3>
//               <p className="text-gray-400 text-sm">{template.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import fetcher from "../../AI-Studio/src/dataProvider";
import { useMutation, useQuery } from "react-query";

export default function VideoCreationUI() {
  const [prompt, setPrompt] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Short Drama");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const categories = [
    { id: "short-drama", name: "Short Drama", icon: <PlusIcon size={16} /> },
    { id: "web-series", name: "Web Series", icon: null },
    { id: "music-videos", name: "Music Videos", icon: null },
  ];

  const templates = [
    {
      id: "rags-to-riches",
      title: "Rags to Riches",
      description: "Create a story of Crypto Billionaire - a rags to riches story...",
    },
    {
      id: "love-story",
      title: "Love Story",
      description: "Create a love story of a college student who hates his classmate...",
    },
    {
      id: "hidden-identity",
      title: "Hidden Identity",
      description: "Create a story of Crypto Billionaire - a rags to riches story.........",
    },
  ];

  const { mutate: generateVideoApi } = useMutation((obj) => fetcher.post(`/chat/start`, obj), {
    onSuccess: (response) => {
      router.push(`/c/${response?.session_id}`);
      setIsLoading(false);
    },
    onError: (error) => {
      alert(error.response.data.message);
      setIsLoading(false);
      console.error("Error generating video:", error);
    },
  });

  const generateVideo = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }
    setIsLoading(true);
    generateVideoApi({
      prompt: prompt,
    });
  };

  const handleTemplateClick = (templateDescription) => {
    setPrompt(templateDescription);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-[760px] mt-10">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-semibold text-white mb-3">Let's make the video together!</h1>
          <p className="text-gray-400">Just a prompt away.</p>
        </div>

        <div className="border border-[#FFFFFF26] rounded-lg p-6 mb-6">
          <textarea
            rows={3}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Give your prompts here..."
            className="w-full bg-transparent text-gray-300 outline-none mb-6"
          />

          <div className="flex justify-between">
            <div className="flex gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center gap-2 py-2 px-4 rounded-md ${
                    selectedCategory === category.name ? "bg-[#353535]" : "bg-[#252525]"
                  }`}
                >
                  {category.icon}
                  <span className="text-[#D2D2D2] text-sm">{category.name}</span>
                </button>
              ))}
            </div>

            <button
              onClick={generateVideo}
              disabled={isLoading}
              className="flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <img src="/images/submit.svg" alt="Submit" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border border-[#FFFFFF26] rounded-lg p-4 cursor-pointer hover:bg-[#252525] hover:border-gray-400 transition-all"
              onClick={() => handleTemplateClick(template.description)}
            >
              <h3 className="text-white mb-2 flex items-center">
                {template.title}
                <span className="ml-2 text-xs text-gray-400">(click to use)</span>
              </h3>
              <p className="text-gray-400 text-sm">{template.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
