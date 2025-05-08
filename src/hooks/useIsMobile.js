import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

// const useIsMobile = (value, queryInput = "(max-width:768px)") => {
//   const [isMobile, setIsMobile] = useState(!!value);

//   const isResponsiveMobile = useMediaQuery(queryInput, { noSsr: true });

//   useEffect(() => {
//     setIsMobile(isResponsiveMobile);
//   }, [isResponsiveMobile]);

//   return isMobile;
// };

// export default useIsMobile;

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || "ontouchstart" in window;
    };

    setIsMobile(checkMobile());

    // Optional: Update on resize if you want to handle orientation changes
    const handleResize = () => setIsMobile(checkMobile());
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};
export default useIsMobile;
