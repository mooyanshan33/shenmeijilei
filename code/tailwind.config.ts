import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        grayWhite: {
          white: "var(--c-white)",
          50: "var(--c-gray-50)",
          100: "var(--c-gray-100)",
          200: "var(--c-gray-200)",
          300: "var(--c-gray-300)",
          400: "var(--c-gray-400)",
          500: "var(--c-gray-500)",
          600: "var(--c-gray-600)",
        },
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "18px",
      },
      boxShadow: {
        subtle: "0 1px 1px rgba(0,0,0,0.02)",
        none: "none",
      },
      spacing: {
        0.5: "2px",
        1.5: "6px",
        3.5: "14px",
      },
      transitionDuration: {
        220: "220ms",
      },
      transitionTimingFunction: {
        kimi: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
} satisfies Config
