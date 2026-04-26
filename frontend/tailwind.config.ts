import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        coral: { DEFAULT: "#FF6B5F", light: "#FF8F85", dark: "#E0554A" },
        mint: { DEFAULT: "#3ED6A3", light: "#6BDFB8", dark: "#2BB88A" },
        blueberry: { DEFAULT: "#4257FF", light: "#6B7BFF", dark: "#3145E0" },
        cream: "#FFF7ED",
        ink: "#161827",
        night: "#0E1020",
        surface: "#1A1D2E",
        "surface-light": "#242840",
        muted: "#8B8FA3",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: { xl: "1rem", "2xl": "1.5rem" },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "slide-up": "slide-up 0.4s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
