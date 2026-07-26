import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-space-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        bg: {
          light: "#ffffff",
          dark: "#0c0c0f",
        },
        ink: {
          light: "#0a0a0a",
          dark: "#f4f4f5",
        },
        gray: {
          50: "var(--gray-50)",
          100: "var(--gray-100)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
          500: "var(--gray-500)",
        },
      },
      borderRadius: {
        card: "16px",
        md: "12px",
        sm: "8px",
        xs: "6px",
      },
      boxShadow: {
        "bryl-resting": "0 8px 22px -14px rgba(0, 0, 0, 0.25)",
        "bryl-hover": "0 18px 36px -20px rgba(0, 0, 0, 0.40)",
        "bryl-modal": "0 40px 90px -20px rgba(0, 0, 0, 0.50)",
      },
      transitionTimingFunction: {
        bryl: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
