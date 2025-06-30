/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: "#5A6428",
        "custom-gradient-start": "#f7e8a3",
        "custom-gradient-middle": "#c7e4af",
        "custom-gradient-end": "#d9d9d9",
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        nohemi: ["Geist", "sans-serif"],
        spacegrotesk: ["Geist", "sans-serif"],
        inter: ["Geist", "sans-serif"],
      },
    },
  },
  plugins: [],
};
