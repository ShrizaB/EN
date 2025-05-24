/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
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
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
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
        // Original colors
        brightRed: "hsl(var(--brightRed))",
        yellow: {
          400: "#ffe066",
          500: "#ffcc00",
          600: "#e6b800",
          900: "#664d00",
        },
        gray: {
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
        blue: {
          400: "#3b82f6",
          500: "#2563eb",
          900: "#1e3a8a",
        },
        math: "hsl(var(--math))",
        science: "hsl(var(--science))",
        reading: "hsl(var(--reading))",
        coding: "hsl(var(--coding))",
        art: "hsl(var(--art))",
        music: "hsl(var(--music))",
        geography: "hsl(var(--geography))",
        logic: "hsl(var(--logic))",
        // TVA colors from both configs
        "tva-brown": "#3C2F2F",
        "tva-brown-dark": "hsl(var(--tva-brown-dark))",
        "tva-brown-light": "hsl(var(--tva-brown-light))",
        "tva-gold": "#D4A017",
        "variant-green": "hsl(var(--variant-green))",
        // Updated Loki/TVA Colors - Brighter Green
        "loki-green": "#00FF88",
        "tva-orange": "#E76F51",
        "dark-gray": "#1A1A1A",
        "light-gray": "#D9D9D9",
      },
      fontFamily: {
        marvel: ["Marvel", "sans-serif"],
        mono: ["Courier New", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      blur: {
        "3xl": "64px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-45px)" },
        },
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "fade-out": {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        "slide-in": {
          from: { transform: "translateY(20px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        "slide-out": {
          from: { transform: "translateY(0)", opacity: 1 },
          to: { transform: "translateY(20px)", opacity: 0 },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: 0 },
          to: { transform: "scale(1)", opacity: 1 },
        },
        "scale-out": {
          from: { transform: "scale(1)", opacity: 1 },
          to: { transform: "scale(0.95)", opacity: 0 },
        },
        // New animations from second config
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-border": {
          "0%, 100%": { borderColor: "#D4A017" },
          "50%": { borderColor: "#00FF88" },
        },
        slither: {
          "0%": { transform: "translateX(-100%) scaleX(0.8)" },
          "50%": { transform: "translateX(0%) scaleX(1.1)" },
          "100%": { transform: "translateX(100%) scaleX(0.8)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        typewriter: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px #00FF88" },
          "50%": { boxShadow: "0 0 20px #00FF88, 0 0 30px #00FF88" },
        },
        "timeline-verify": {
          "0%": { transform: "translateX(-100%) scaleY(0.5)", opacity: "0" },
          "50%": { transform: "translateX(50%) scaleY(1)", opacity: "1" },
          "100%": { transform: "translateX(200%) scaleY(0.5)", opacity: "0" },
        },
        "data-stream": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        "energy-pulse": {
          "0%": { transform: "scale(0.8)", opacity: "0.3" },
          "50%": { transform: "scale(1.2)", opacity: "0.8" },
          "100%": { transform: "scale(0.8)", opacity: "0.3" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-out": "slide-out 0.3s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "scale-out": "scale-out 0.3s ease-out",
        float: "float 2.5s ease-in-out infinite",
        "glow-slow": "pulse 4s infinite ease-in-out",
        // New animations from second config
        rotate: "rotate 20s linear infinite",
        "pulse-border": "pulse-border 2s ease-in-out infinite",
        slither: "slither 3s ease-in-out infinite",
        bounce: "bounce 2s ease-in-out infinite",
        typewriter: "typewriter 2s steps(40) 1s both",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "timeline-verify": "timeline-verify 4s ease-in-out infinite",
        "data-stream": "data-stream 3s ease-in-out infinite",
        "energy-pulse": "energy-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};