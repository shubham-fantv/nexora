import { useState, useEffect } from "react";

export default function ThinkingAnimation({ isThinking = true, color = "#6e6e6e" }) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!isThinking) return;

    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 3) return "";
        return prevDots + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isThinking]);

  if (!isThinking) return null;

  return (
    <div className="flex text-black items-center">
      <div className="text-sm font-medium mr-2" style={{ color }}>
        Thinking
      </div>
      <div className="flex space-x-1">
        <Dot visible={dots.length >= 1} color={color} />
        <Dot visible={dots.length >= 2} color={color} />
        <Dot visible={dots.length >= 3} color={color} />
      </div>
    </div>
  );
}

// Individual dot component with animation
function Dot({ visible, color }) {
  return (
    <div
      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ease-in-out ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-75"
      }`}
      style={{ backgroundColor: color }}
    />
  );
}
