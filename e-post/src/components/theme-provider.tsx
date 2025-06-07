// import type React from "react";
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";

// Define the possible theme values
type Theme = "dark" | "light" | "system";

// Define the props for the ThemeProvider component
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme; // Default theme if nothing is stored
  storageKey?: string;  // Key used in localStorage
};

// Define the shape of the context state
type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Initial state for the context (used before provider mounts)
const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null, // No-op function initially
};

// Create the React Context
const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

/**
 * Provides theme state (light, dark, system) to the application
 * and handles applying the theme class to the HTML element and persisting
 * the preference in localStorage.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "myapp-theme", // Changed default key slightly
  ...props // Pass any other props down to the context provider
}: ThemeProviderProps) {
  // Initialize theme state: Read from localStorage first, then use defaultTheme
  // This direct read is okay for pure client-side apps.
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  // Effect to apply the theme class to the <html> element
  useEffect(() => {
    const root = window.document.documentElement; // Get the <html> element

    // Remove previous theme classes
    root.classList.remove("light", "dark");

    // Apply the current theme class
    if (theme === "system") {
      // Check the OS preference if theme is 'system'
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      // Apply the explicitly chosen theme ('light' or 'dark')
      root.classList.add(theme);
    }
  }, [theme]); // Re-run this effect whenever the theme state changes

  // Memoized context value
  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      // Persist the new theme choice in localStorage
      localStorage.setItem(storageKey, newTheme);
      // Update the React state, triggering the useEffect above
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

/**
 * Custom hook to easily consume the theme context (theme and setTheme function).
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  // Ensure the hook is used within a ThemeProvider
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};