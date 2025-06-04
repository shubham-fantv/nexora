import React, { useEffect, useRef, useState } from "react";
import RenderMarkdown from "../RenderMarkdown";

const ScriptViewer = ({ initialScript, prevScript, nextScript }) => {
  console.log("🚀 ~ ScriptViewer ~ initialScript:", initialScript, prevScript);
  console.log("🚀 ~ ScriptViewer ~ nextScript:", nextScript);

  const [scripts, setScripts] = useState([initialScript]);
  const [hasLoadedPrev, setHasLoadedPrev] = useState(false);
  const [hasLoadedNext, setHasLoadedNext] = useState(false);

  const loadPrevScript = () => {
    if (prevScript && !hasLoadedPrev) {
      setScripts((prev) => [prevScript, ...prev]);
      setHasLoadedPrev(true);
    }
  };

  const loadNextScript = () => {
    if (nextScript && !hasLoadedNext) {
      setScripts((prev) => [...prev, nextScript]);
      setHasLoadedNext(true);
    }
  };

  return (
    <div style={{ height: "calc(100vh - 60px)" }}>
      {/* Load Previous Script */}
      {prevScript && (
        <div className="mb-4 text-center">
          <button onClick={loadPrevScript} className="text-blue-600 underline">
            Load Previous Scene
          </button>
        </div>
      )}

      <div className="mb-6 text-[#5D5D5D]">
        <RenderMarkdown markdown={initialScript} />
      </div>

      {/* Load Next Script */}
      {nextScript && (
        <div className="mt-4 text-center">
          <button onClick={loadNextScript} className="text-blue-600 underline">
            Load Next Scene
          </button>
        </div>
      )}
    </div>
  );
};

export default ScriptViewer;
