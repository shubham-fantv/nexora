import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography, Box } from "@mui/material";

// const styles = {
//   root: {
//     height: "100vh",
//     display: "flex",
//     backgroundColor: "custom.earnCoinBg",
//     "& > * + *": {
//       marginLeft: "8px",
//     },
//     position: "absolute",
//     height: "100vh",
//     width: "100wv",
//   },
//   container: {
//     justifyContent: "center",
//     alignItems: "center",
//     color: "custom.white",
//     margin: "auto",
//     textAlign: "center",
//     "& p": {
//       fontWeight: 600,
//       fontSize: "24px",
//     },
//     "& span": {
//       fontWeight: 400,
//       fontSize: "16px",
//       opacity: "0.5",
//     },
//   },
//   activeCircular: {
//     marginTop: "20px",
//     color: "custom.white !important",
//     zIndex: 10,
//   },
// };

// export default function Loading({ label = "Please wait", text = "Loading", customStyles = {} }) {
//   return (
//     <Box sx={{ ...styles.root, ...customStyles }}>
//       <Box sx={styles.container}>
//         <Typography component="p">{label}</Typography>
//         <Typography component="span">{text}</Typography>
//         <Box>
//           <CircularProgress sx={styles.activeCircular} />
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// import React from "react";

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
