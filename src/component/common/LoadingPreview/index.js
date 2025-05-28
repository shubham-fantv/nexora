import { useState, useEffect, useRef } from "react";

export default function LoadingPreview({
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
  const [scrollPosition, setScrollPosition] = useState(0);
  const featureListRef = useRef(null);

  // Calculate total height for scrolling
  const calculateTotalHeight = () => {
    if (!featureListRef.current) return 0;
    return featureListRef.current.scrollHeight / 2;
  };

  useEffect(() => {
    // Fade in the component after mounting
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Create vertical scrolling animation
    const animationSpeed = 50; // Lower is faster
    const totalHeight = calculateTotalHeight();

    if (totalHeight === 0) return;

    const scrollInterval = setInterval(() => {
      setScrollPosition((prevPos) => {
        // Reset when we've scrolled through all items
        if (prevPos >= totalHeight) {
          return 0;
        }
        return prevPos + 1;
      });
    }, animationSpeed);

    return () => clearInterval(scrollInterval);
  }, []);

  // Create gradient color stops - transparent to solid to transparent
  const topGradient = `linear-gradient(to bottom, ${gradientColor} 0%, rgba(255, 255, 255, 0) 100%)`;
  const bottomGradient = `linear-gradient(to top, ${gradientColor} 0%, rgba(255, 255, 255, 0) 100%)`;

  return (
    <div
      className="flex flex-col items-center justify-center w-full  transition-opacity duration-500"
      style={{
        color: textColor,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="w-full max-w-md h-64 overflow-hidden relative">
        <div
          className="absolute top-0 left-0 w-full h-8 z-10"
          style={{ background: topGradient }}
        />

        <div
          ref={featureListRef}
          className="absolute w-full"
          style={{
            transform: `translateY(-${scrollPosition}px)`,
          }}
        >
          {features.map((feature, index) => (
            <div key={index} className="flex items-center py-4 px-4">
              <span className="text-2xl mr-4">{feature.icon}</span>
              <span className="text-base">{feature.text}</span>
            </div>
          ))}

          {features.map((feature, index) => (
            <div key={`duplicate-${index}`} className="flex items-center py-4 px-4">
              <span className="text-2xl mr-4">{feature.icon}</span>
              <span className="text-base">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Bottom gradient overlay */}
        <div
          className="absolute bottom-0 left-0 w-full h-8 z-10"
          style={{ background: bottomGradient }}
        />
      </div>
    </div>
  );
}
