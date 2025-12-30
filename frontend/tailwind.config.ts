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
        // Unified Dark Palette
        surface: {
          DEFAULT: "rgb(var(--surface))",
          elevated: "rgb(var(--surface-elevated))",
        },
        border: { DEFAULT: "rgb(var(--border-rgb))" },
        primary: { DEFAULT: "rgb(var(--primary-rgb))" },
        accent: { DEFAULT: "rgb(var(--accent-rgb))" },
        "text-primary": { DEFAULT: "rgb(var(--text-primary))" },
        "text-muted": { DEFAULT: "rgb(var(--text-muted))" },

        // Custom primary colors with RGB
        "primary-rgb": {
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

        // UI Colors (keeping existing HSL-based system)
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
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
        xl: "1rem",
        "2xl": "1.5rem",
      },

      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'card': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04)',
        'card-hover': '0 0 0 1px rgba(0,0,0,0.03), 0 8px 16px rgba(0,0,0,0.08)',
        'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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
      xs: "320px",    // Mobile Portrait
      sm: "480px",    // Large Mobile
      md: "768px",    // Tablet Portrait
      lg: "1024px",   // Tablet Landscape
      xl: "1280px",   // Desktop
      "2xl": "1536px", // Large Desktop
      "3xl": "1920px", // Ultra Wide
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
  ],
};

export default config;
