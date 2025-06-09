import React, { useRef, useState } from "react";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import fetcher from "../src/dataProvider";
import Loader from "../src/component/common/Loading/loading";
import { Box, useMediaQuery } from "@mui/system";

export default function VideoCreationUI() {
  const [prompt, setPrompt] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Short Drama");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:768px)");
  const videoRef = useRef(null);
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
    <div className="relative w-full h-[calc(100vh)] overflow-hidden">
      <video
        ref={videoRef}
        playsInline
        muted
        loop
        autoPlay
        preload="eager"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/video/bgVideo.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <div
        style={{ position: "absolute", top: "15px", left: "40px" }}
        onClick={() => window?.open("/", "_self", "noopener,noreferrer")}
      >
        {isMobile ? (
          <div>
            <img
              src={"/images/logo.svg"}
              alt="mobile FanTV logo"
              loading="eager"
              decoding="async"
            />
          </div>
        ) : (
          <div>
            <img
              src={"/images/logo.svg"}
              alt="FanTV Logo"
              width={170}
              loading="eager"
              decoding="async"
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex text-black items-center justify-center w-full h-full">
        <div className="w-full max-w-[760px] mt-10">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-5xl font-bold  mb-3">Let's make an awesome Video!</h1>
            <p className="text-[#5D5D5D]">
              Create web series, vertical videos, films, music video, reels, ads or anything you
              love
            </p>
          </div>

          <div className="border bg-[#FFF] border-[#FFFFFF] rounded-lg p-6 mb-6">
            <textarea
              rows={3}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Give your prompts here..."
              className="w-full bg-transparent text-[#5D5D5D] outline-none mb-6"
            />

            <div className="flex justify-between">
              <div className="flex gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center gap-2 py-2 px-4 rounded-md ${
                      selectedCategory === category.name ? "bg-[#1818180D]" : "bg-[#1818180D]"
                    }`}
                  >
                    {category.icon}
                    <span className="text-[#5D5D5D] text-sm">{category.name}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={generateVideo}
                disabled={isLoading}
                className="flex items-center bg-[#181818] h-10 w-10  rounded-md justify-center"
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
                className="border bg-[#FFFFFF] border-[#18181826] rounded-lg p-4 cursor-pointer hover:bg-[#FFFFFF] hover:border-gray-400 transition-all"
                onClick={() => handleTemplateClick(template.description)}
              >
                <h3 className="text-[#181818] mb-2 flex items-center">
                  {template.title}
                  <span className="ml-2 text-xs text-[#5D5D5D]">(click to use)</span>
                </h3>
                <p className="text-[#5D5D5D] text-sm">{template.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      asLayout: "EmptyLayout",
    },
  };
}
