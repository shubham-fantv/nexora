// import { motion } from "framer-motion";

// const TextReveal = ({ children, delay = 0 }) => {
//   const animationVariants = {
//     hidden: { opacity: 0.1, y: 100 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         type: "fadeIn",
//         duration: 0.5,
//         delay: delay,
//         ease: "easeInOut",
//       },
//     },
//   };

//   return (
//     <motion.div initial="hidden" animate="visible" variants={animationVariants}>
//       {children}
//     </motion.div>
//   );
// };

// export default TextReveal;

import { motion } from "framer-motion";

const TextReveal = ({ children, delay = 0 }) => {
  const animationVariants = {
    hidden: {
      opacity: 0,
      y: 0, // Start from above
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        duration: 1,
        ease: [1, 1, 0, 0],
        duration: 1,
        delay: delay,
      },
    },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={animationVariants}>
      {children}
    </motion.div>
  );
};

export default TextReveal;
