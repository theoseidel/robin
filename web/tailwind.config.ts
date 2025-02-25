import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBlue: "161b26", // Adjust this to match the Audubon theme
        accentBlue: "#262a36",
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
  important: true, // This helps prevent Mapbox styles from being overridden
};
export default config;
