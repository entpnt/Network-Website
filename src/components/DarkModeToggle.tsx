import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import {
  toggleDarkMode,
  isDarkMode,
  initializeDarkMode,
} from "../lib/brandConfig";

interface DarkModeToggleProps {
  className?: string;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className = "" }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Initialize dark mode on mount
    const initialDarkMode = initializeDarkMode();
    setDarkMode(initialDarkMode);
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const newMode = toggleDarkMode();
    setDarkMode(newMode);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`h-9 w-9 ${className}`}
        disabled
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={`h-9 w-9 transition-colors hover:bg-accent hover:text-accent-foreground ${className}`}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <Sun className="h-4 w-4 transition-transform" />
      ) : (
        <Moon className="h-4 w-4 transition-transform" />
      )}
    </Button>
  );
};

export default DarkModeToggle;
