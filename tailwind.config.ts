import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: "rgb(var(--color-primary))",
          dark: "rgb(var(--color-primary-dark))",
          light: "rgb(var(--color-primary-light))",
        },

        // Background colors
        bg: {
          primary: "rgb(var(--color-bg-primary))",
          secondary: "rgb(var(--color-bg-secondary))",
          tertiary: "rgb(var(--color-bg-tertiary))",
          sidebar: "rgb(var(--color-bg-sidebar))",
        },

        // Text colors
        text: {
          primary: "rgb(var(--color-text-primary))",
          secondary: "rgb(var(--color-text-secondary))",
          muted: "rgb(var(--color-text-muted))",
          white: "rgb(var(--color-text-white))",
        },

        // Status colors
        success: "rgb(var(--color-success))",
        warning: "rgb(var(--color-warning))",
        error: "rgb(var(--color-error))",
        info: "rgb(var(--color-info))",

        // Chart colors
        chart: {
          1: "rgb(var(--color-chart-1))",
          2: "rgb(var(--color-chart-2))",
          3: "rgb(var(--color-chart-3))",
          4: "rgb(var(--color-chart-4))",
          5: "rgb(var(--color-chart-5))",
        },

        // Map colors
        map: {
          base: "rgb(var(--color-map-base))",
          highlight1: "rgb(var(--color-map-highlight-1))",
          highlight2: "rgb(var(--color-map-highlight-2))",
          highlight3: "rgb(var(--color-map-highlight-3))",
        },

        // UI Colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      fontSize: {
        xs: "var(--font-size-xs)",
        sm: "var(--font-size-sm)",
        base: "var(--font-size-base)",
        lg: "var(--font-size-lg)",
        xl: "var(--font-size-xl)",
        "2xl": "var(--font-size-2xl)",
        "3xl": "var(--font-size-3xl)",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
        "7xl": "4.5rem",
      },

      letterSpacing: {
        tighter: "-0.025em",
        tight: "-0.015em",
      },

      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        "2xl": "var(--spacing-2xl)",
        "3xl": "4rem",
        "4xl": "8rem",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "card-hover":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },

      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      zIndex: {
        header: "1000",
        sidebar: "900",
        overlay: "1100",
      },

      ringWidth: {
        DEFAULT: "3px",
      },
      ringColor: {
        primary: "rgb(var(--color-primary-dark))",
      },
    },
    screens: {
      xs: "320px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
  ],
};

export default config;
