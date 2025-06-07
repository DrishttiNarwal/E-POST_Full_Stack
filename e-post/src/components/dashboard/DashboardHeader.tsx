import { useAuth } from "../auth-provider"; // Your auth context hook
import { ModeToggle } from "../ModeToggle"; // Theme toggle component
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"; // UI components
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Bell, Settings, User, LogOut } from "lucide-react"; // Icons (added LogOut for clarity)
import { Link } from "react-router-dom"; // Standard client-side routing link

export function DashboardHeader() {
  const { currentUser, logout } = useAuth(); // Get user data and logout function from context

  // --- Handler for Logout ---
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* Placeholder for potential sidebar toggle on mobile */}
      <div className="md:hidden w-4" />

      {/* Header Actions - Right Aligned */}
      <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">

        {/* Theme Toggle */}
        <ModeToggle />

        {/* User Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={"/user.jpg"} 
                  alt={currentUser?.name || "User Avatar"}
                />
                <AvatarFallback>
                  {/* Display initials if user exists, otherwise 'U' */}
                  {currentUser?.name
                    ? currentUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            {/* Display User Info if available */}
            {currentUser && (
              <>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {currentUser.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email || "No email provided"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.id || "User ID not available"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}
            {/* Dropdown Actions */}
            <DropdownMenuItem asChild>
              {/* Ensure these routes exist in your App.tsx */}
              <Link to="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* Logout Action */}
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50" // Destructive action styling
              onClick={handleLogout} // Call the logout handler
            >
              <LogOut className="mr-2 h-4 w-4" /> {/* Use explicit icon */}
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}