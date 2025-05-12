import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography, Box } from "@mui/material";

const Loader = ({ title = "Please wait", subTitle = "Loading..." }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mb-6" />
      <h2 className="text-white text-xl font-semibold">{title}</h2>
      <p className="text-white text-sm mt-1">{subTitle}</p>
    </div>
  );
};

export default Loader;
