import { Moon, Sun } from "lucide-react"; // Icons
// Make sure this path is correct in your new project structure
import { useTheme } from "./theme-provider"; // Your theme context hook (likely from next-themes via your provider file)
import { Button } from "./ui/button"; // Your UI components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ModeToggle() {
  // useTheme should work correctly if ThemeProvider is wrapping your app in index.tsx
  const { theme, setTheme } = useTheme();

  // The rendering logic relies on:
  // 1. The theme value ('light', 'dark') provided by useTheme
  // 2. CSS (likely Tailwind) being configured for dark mode variants (dark:...)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Toggle theme"> {/* Added aria-label */}
          {/* Sun icon shown in light mode, hidden (scaled to 0) in dark mode */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          {/* Moon icon hidden (scaled to 0) in light mode, shown in dark mode */}
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Menu items call setTheme provided by the context */}
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}