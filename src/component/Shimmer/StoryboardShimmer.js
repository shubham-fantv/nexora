import React from "react";

// Simple shimmer component for loading states
const ShimmerCard = ({ className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {/* Image placeholder */}
      <div className="aspect-video bg-gray-200 rounded-t-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
      </div>

      {/* Content placeholder */}
      <div className="p-4 bg-white rounded-b-lg">
        {/* Title line */}
        <div className="h-4 bg-gray-200 rounded mb-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
        </div>

        {/* Description lines */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-4/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-3/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
          </div>
        </div>

        {/* Dialogue indicator */}
        <div className="h-3 bg-gray-200 rounded w-24 mb-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
        </div>

        {/* Button placeholder */}
        <div className="h-10 bg-gray-200 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};
export default ShimmerCard;

const ShimmerOverlay = () => {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
      <div className="w-full h-full relative overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-fast"></div>
      </div>
    </div>
  );
};

// const ShimmerDemo = () => {
//   const [isLoading, setIsLoading] = React.useState(true);

//   // Simulate API call
//   React.useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 3000);
//     return () => clearTimeout(timer);
//   }, []);

//   const resetDemo = () => {
//     setIsLoading(true);
//     setTimeout(() => setIsLoading(false), 3000);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800">Shimmer Loading Components</h1>
//           <button
//             onClick={resetDemo}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Restart Demo
//           </button>
//         </div>

//         {/* Grid of shimmer cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
//           {isLoading ? (
//             // Show shimmer cards while loading
//             <>
//               <ShimmerCard className="shadow-lg" />
//               <ShimmerCardDark className="shadow-lg" />
//               <ShimmerCard className="shadow-lg" />
//               <ShimmerCardDark className="shadow-lg" />
//               <ShimmerCard className="shadow-lg" />
//               <ShimmerCardDark className="shadow-lg" />
//             </>
//           ) : (
//             // Show actual content after loading
//             <>
//               <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//                 <div className="aspect-video bg-gradient-to-br from-amber-400 to-orange-600 relative flex items-center justify-center">
//                   <span className="text-white font-semibold">Shot 1.1</span>
//                 </div>
//                 <div className="p-4">
//                   <p className="text-gray-600 text-sm mb-4">Content loaded successfully!</p>
//                   <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg">
//                     Create
//                   </button>
//                 </div>
//               </div>

//               <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
//                 <div className="aspect-video bg-gradient-to-br from-blue-600 to-indigo-800 relative flex items-center justify-center">
//                   <span className="text-white font-semibold">Shot 1.2</span>
//                 </div>
//                 <div className="p-4">
//                   <p className="text-gray-300 text-sm mb-4">Content loaded successfully!</p>
//                   <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg">
//                     Create
//                   </button>
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//                 <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-600 relative flex items-center justify-center">
//                   <span className="text-white font-semibold">Shot 1.3</span>
//                 </div>
//                 <div className="p-4">
//                   <p className="text-gray-600 text-sm mb-4">Content loaded successfully!</p>
//                   <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg">
//                     Create
//                   </button>
//                 </div>
//               </div>

//               <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
//                 <div className="aspect-video bg-gradient-to-br from-purple-600 to-pink-600 relative flex items-center justify-center">
//                   <span className="text-white font-semibold">Shot 1.4</span>
//                 </div>
//                 <div className="p-4">
//                   <p className="text-gray-300 text-sm mb-4">Content loaded successfully!</p>
//                   <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg">
//                     Create
//                   </button>
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//                 <div className="aspect-video bg-gradient-to-br from-red-400 to-yellow-600 relative flex items-center justify-center">
//                   <span className="text-white font-semibold">Shot 1.5</span>
//                 </div>
//                 <div className="p-4">
//                   <p className="text-gray-600 text-sm mb-4">Content loaded successfully!</p>
//                   <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg">
//                     Create
//                   </button>
//                 </div>
//               </div>

//               <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
//                 <div className="aspect-video bg-gradient-to-br from-indigo-400 to-cyan-600 relative flex items-center justify-center">
//                   <span className="text-white font-semibold">Shot 1.6</span>
//                 </div>
//                 <div className="p-4">
//                   <p className="text-gray-300 text-sm mb-4">Content loaded successfully!</p>
//                   <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg">
//                     Create
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Usage Examples */}
//         <div className="bg-white rounded-lg p-6 shadow-lg">
//           <h2 className="text-xl font-semibold mb-4">Usage Examples:</h2>
//           <div className="space-y-4 text-sm">
//             <div className="bg-gray-50 p-4 rounded">
//               <strong>1. Replace entire card while loading:</strong>
//               <pre className="mt-2 text-xs overflow-x-auto">
//                 {`{isLoading ? (
//   <ShimmerCard />
// ) : (
//   <YourActualCard />
// )}`}
//               </pre>
//             </div>

//             <div className="bg-gray-50 p-4 rounded">
//               <strong>2. Use as overlay on existing card:</strong>
//               <pre className="mt-2 text-xs overflow-x-auto">
//                 {`<div className="relative">
//   <YourActualCard />
//   {isLoading && <ShimmerOverlay />}
// </div>`}
//               </pre>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShimmerDemo;
