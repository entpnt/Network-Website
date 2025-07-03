// Brand Configuration
// This file allows easy customization of brand colors across the entire application

export interface BrandConfig {
  primary: string;
  primaryForeground: string;
  secondary?: string;
  secondaryForeground?: string;
}

export interface DarkModeConfig {
  bgPrimary: string;
  bgSecondary: string;
  bgCard: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  accent: string;
}

// Default brand configuration
export const defaultBrandConfig: BrandConfig = {
  primary: "#DE5A00",
  primaryForeground: "#ffffff",
  secondary: "#FFEBDE",
  secondaryForeground: "#2F2B36",
};

// Dark mode color configuration
export const darkModeConfig: DarkModeConfig = {
  bgPrimary: "#121212",
  bgSecondary: "#1A1A1A",
  bgCard: "#1E1E1E",
  textPrimary: "#F2F2F2",
  textSecondary: "#B0B0B0",
  border: "#333333",
  accent: "#2A2A2A",
};

// Secondary brand color for complementary styling
export const secondaryBrandColor = "#FFEBDE";

// Accent/Neutral colors for the template
export const accentColors = {
  white: "#FFFFFF",
  lightGray: "#F7F7F7",
  softGray: "#BBBDC8",
  mediumGray: "#76747B",
  darkCharcoal: "#2F2B36",
};

// Dark mode accent colors
export const darkAccentColors = {
  darkGray: "#121212",
  mediumDark: "#1A1A1A",
  cardDark: "#1E1E1E",
  lightText: "#F2F2F2",
  mutedText: "#B0B0B0",
  borderDark: "#333333",
  accentDark: "#2A2A2A",
};

// Function to apply brand colors to CSS variables
export const applyBrandColors = (
  config: BrandConfig = defaultBrandConfig,
  isDark: boolean = false,
) => {
  const root = document.documentElement;
  root.style.setProperty("--brand-primary", config.primary);
  root.style.setProperty(
    "--brand-primary-foreground",
    config.primaryForeground,
  );

  if (isDark) {
    root.style.setProperty("--brand-secondary", "rgba(255, 235, 222, 0.1)");
    root.style.setProperty(
      "--brand-secondary-foreground",
      darkModeConfig.textPrimary,
    );
  } else {
    root.style.setProperty(
      "--brand-secondary",
      config.secondary || secondaryBrandColor,
    );
    root.style.setProperty(
      "--brand-secondary-foreground",
      config.secondaryForeground || "#2F2B36",
    );
  }
};

// Function to apply dark mode colors
export const applyDarkModeColors = (
  darkConfig: DarkModeConfig = darkModeConfig,
) => {
  const root = document.documentElement;
  root.style.setProperty("--dark-bg-primary", darkConfig.bgPrimary);
  root.style.setProperty("--dark-bg-secondary", darkConfig.bgSecondary);
  root.style.setProperty("--dark-bg-card", darkConfig.bgCard);
  root.style.setProperty("--dark-text-primary", darkConfig.textPrimary);
  root.style.setProperty("--dark-text-secondary", darkConfig.textSecondary);
  root.style.setProperty("--dark-border", darkConfig.border);
  root.style.setProperty("--dark-accent", darkConfig.accent);
};

// Function to get current brand colors
export const getBrandColors = (): BrandConfig => {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  return {
    primary:
      computedStyle.getPropertyValue("--brand-primary").trim() ||
      defaultBrandConfig.primary,
    primaryForeground:
      computedStyle.getPropertyValue("--brand-primary-foreground").trim() ||
      defaultBrandConfig.primaryForeground,
  };
};

// Dark mode utilities
export const isDarkMode = () => {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("dark");
};

export const toggleDarkMode = () => {
  if (typeof window === "undefined") return;

  const isDark = isDarkMode();
  const newMode = !isDark;

  if (newMode) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("darkMode", "true");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", "false");
  }

  // Apply brand colors with new mode
  applyBrandColors(defaultBrandConfig, newMode);
  applyDarkModeColors();

  return newMode;
};

export const initializeDarkMode = () => {
  if (typeof window === "undefined") return;

  // Check for saved preference - only use dark mode if explicitly set to true
  const savedMode = localStorage.getItem("darkMode");
  const shouldUseDark = savedMode === "true";

  if (shouldUseDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // Apply initial colors
  applyBrandColors(defaultBrandConfig, shouldUseDark);
  applyDarkModeColors();

  return shouldUseDark;
};

// Predefined brand color schemes for different ISPs
export const brandPresets = {
  orange: {
    primary: "#DE5A00",
    primaryForeground: "#ffffff",
    secondary: "#FFEBDE",
    secondaryForeground: "#2F2B36",
  },
  blue: {
    primary: "#0066CC",
    primaryForeground: "#ffffff",
    secondary: "#E6F3FF",
    secondaryForeground: "#1A1A1A",
  },
  green: {
    primary: "#00AA44",
    primaryForeground: "#ffffff",
    secondary: "#E6F7ED",
    secondaryForeground: "#1A1A1A",
  },
  purple: {
    primary: "#7C3AED",
    primaryForeground: "#ffffff",
    secondary: "#F3E8FF",
    secondaryForeground: "#1A1A1A",
  },
  red: {
    primary: "#DC2626",
    primaryForeground: "#ffffff",
    secondary: "#FEE2E2",
    secondaryForeground: "#1A1A1A",
  },
};
