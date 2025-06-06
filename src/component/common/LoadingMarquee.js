import { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";

export default function LoadingMarquee({
  logoSrc = "/heart-logo.svg",
  features = [
    { icon: "🤖", text: "Generate entire web series episodes using AI" },
    { icon: "🎬", text: "Customize storyline, genre, and characters" },
    { icon: "🧠", text: "Train AI with your own scripts or ideas" },
    { icon: "🌐", text: "Collaborate and share via GitHub or web platform" },
    { icon: "📦", text: "Store series data securely with Supabase" },
    { icon: "⚡", text: "Real-time editing and instant previews" },
  ],
  textColor = "#6b6b6b",
  loadingText = "Spinning up preview...",
  gradientColor = "#FFF",
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const gradientOverlay = {
    background: `linear-gradient(to right, ${gradientColor} 0%, rgba(255,255,255,0) 100%)`,
  };

  return (
    <div
      className="flex items-center justify-center w-full transition-opacity duration-500"
      style={{
        color: textColor,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="w-full max-w-4xl px-10 pt-1 relative overflow-hidden h-20">
        <div className="absolute left-0 top-0 h-full w-10 z-10" style={gradientOverlay} />
        <div
          className="absolute right-0 top-0 h-full w-10 z-10"
          style={{
            background: `linear-gradient(to left, ${gradientColor} 0%, rgba(255,255,255,0) 100%)`,
          }}
        />

        <Marquee gradient={false} speed={50} pauseOnHover={true}>
          {features.map((feature, index) => (
            <div key={index} className="flex items-center mx-8 whitespace-nowrap">
              <span className="text-2xl mr-3">{feature.icon}</span>
              <span className="text-base">{feature.text}</span>
            </div>
          ))}
        </Marquee>
        <div className="animate-spin w-8 h-8 border-2 border-black flex justify-center m-auto border-t-transparent rounded-full" />
      </div>
    </div>
  );
}
