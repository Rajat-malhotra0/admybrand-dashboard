"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("light");
  const [isHydrated, setIsHydrated] = useState(false);

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    if (typeof window === "undefined") return;
    
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  // Set theme with persistence
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
    applyTheme(newTheme);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    const initializeTheme = () => {
      try {
        // Check if we're in a browser environment
        if (typeof window === "undefined") return;
        
        // Get saved theme from localStorage or system preference
        const savedTheme = localStorage.getItem("theme") as Theme;
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const initialTheme = savedTheme || systemTheme;
        
        // Apply theme without state update to avoid flicker
        applyTheme(initialTheme);
        
        // Update state after a small delay to ensure hydration
        setTimeout(() => {
          setThemeState(initialTheme);
          setIsHydrated(true);
        }, 10);
      } catch (error) {
        console.error("Failed to initialize theme:", error);
        setIsHydrated(true);
      }
    };

    initializeTheme();
    
    // Cleanup function
    return () => {};
  }, []);

  // Apply theme changes after hydration
  useEffect(() => {
    if (isHydrated) {
      applyTheme(theme);
    }
  }, [theme, isHydrated]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div data-testid={isHydrated ? (theme === 'dark' ? 'dark-mode-active' : 'light-mode-active') : 'loading'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
