import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /**
         * Gray-White palette (韩系极简灰白色阶)
         * Source of truth is `index.html :root` variables.
         */
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        /**
         * Legacy token name used across the app.
         * In this visual system it maps to “ink” (克制的强调色).
         */
        neon: {
          DEFAULT: "#1f1f1f",
          light: "#374151",
          dark: "#111827",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', "serif"],
        sans: ["var(--font-sans)"],
      },
      borderRadius: {
        sm: "10px",
        md: "12px",
        lg: "16px",
        xl: "22px",
      },
      boxShadow: {
        none: "none",
        subtle: "0 1px 0 rgba(31,31,31,0.03)",
        card: "0 1px 0 rgba(31,31,31,0.03)",
      },
      transitionDuration: {
        220: "220ms",
        240: "240ms",
      },
      transitionTimingFunction: {
        kimi: "cubic-bezier(0.2, 0.9, 0.2, 1)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.24s ease-out forwards",
        "fade-in": "fade-in 0.22s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config

