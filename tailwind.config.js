/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
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
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        /* Keep legacy token name, but make it “克制极简” */
        neon: {
          DEFAULT: "#1f1f1f",
          light: "#374151",
          dark: "#111827",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ["var(--font-sans)"],
      },
      borderRadius: {
        xl: "22px",
        lg: "16px",
        md: "12px",
        sm: "10px",
        xs: "calc(var(--radius) - 6px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        /* 极轻阴影：几乎无（用于 hover 的“层级感”） */
        subtle: "0 1px 0 rgba(31,31,31,0.03)",
        card: "0 1px 0 rgba(31,31,31,0.03)",
        glow: "0 0 0 rgba(0,0,0,0)",
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
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "ripple": {
          "0%": { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(3)", opacity: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(209, 213, 219, 0.25)" },
          "50%": { boxShadow: "0 0 40px rgba(209, 213, 219, 0.45)" },
        },
        "heart-beat": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)" },
        },
        "draw-line": {
          "0%": { height: "0" },
          "100%": { height: "100%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "ripple": "ripple 0.24s ease-out 1",
        "fade-in-up": "fade-in-up 0.24s ease-out forwards",
        "fade-in": "fade-in 0.22s ease-out forwards",
        "slide-in-right": "slide-in-right 0.24s ease-out forwards",
        "slide-out-right": "slide-out-right 0.22s ease-out forwards",
        "slide-up": "slide-up 0.24s ease-out forwards",
        "scale-in": "scale-in 0.22s ease-out forwards",
        "pulse-glow": "pulse-glow 0.24s ease-out 1",
        "heart-beat": "heart-beat 0.22s ease-out",
        "draw-line": "draw-line 1s ease forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
