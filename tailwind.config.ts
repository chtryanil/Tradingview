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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#2962FF",
        secondary: "#414A6B",
        accent: "#00C853",
        neutral: "#B2B5BE",
        "base-100": "#1E222D",
        "base-200": "#2B2B43",
        "base-300": "#363A45",
        success: "#26a69a",
        warning: "#ff9800",
        error: "#ef5350",
      },
    },
  },
  plugins: [],
};
export default config;
