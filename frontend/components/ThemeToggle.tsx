"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 opacity-0 pointer-events-none"
        aria-label="Theme toggle loading"
        style={{ width: '40px', height: '40px' }}
      />
    );
  }

  const handleToggle = () => {
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-border/50 text-text-muted hover:text-primary active:scale-95"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
