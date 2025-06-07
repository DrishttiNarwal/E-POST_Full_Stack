/** @type {import('tailwindcss').Config} */

// Use module.exports for broader compatibility with build tools
module.exports = {
  // Enable dark mode based on the 'dark' class on the <html> tag
  // This works well with the ThemeProvider (next-themes)
  darkMode: ["class"],

  // Configure the paths Tailwind should scan for class names
  content: [
    "./public/index.html",        // Standard location for index.html (CRA, Webpack)
    "./index.html",               // Alternative location for index.html (Vite, Parcel)
    "./src/**/*.{js,ts,jsx,tsx}", // Scan all relevant files within the src directory
    // Removed root scan "*.{js,ts,jsx,tsx,mdx}" - add back only if needed
  ],

  // Optional: Prefix Tailwind classes (e.g., "tw-") if needed to avoid conflicts
  // prefix: "",

  theme: {
    // Standard container setup
    container: {
      center: true,
      padding: "0rem",
      screens: {
        "xl": "1400px",
      },
    },
    extend: {
      // Colors configured to use CSS variables provided by your global CSS (e.g., index.css)
      // Ensure these variables are defined there!
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
        // Keep custom sidebar colors if you defined and use them
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          // ... other sidebar colors if defined in your CSS
        },
      },
      // Border radius using a CSS variable (ensure --radius is defined in CSS)
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Keyframes for animations (used by shadcn/ui components)
      keyframes: {
        "accordion-down": {
          from: { height: "0" }, // Use string "0" for CSS values
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }, // Use string "0"
        },
      },
      // Animation definitions
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  // Include necessary plugins
  plugins: [
    require("tailwindcss-animate") // Make sure this plugin is installed
  ],
}