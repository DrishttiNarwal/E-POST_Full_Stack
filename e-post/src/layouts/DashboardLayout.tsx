import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth-provider";
import { LogOut, Package, Search, Home, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { ModeToggle } from "../components/ModeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export default function DashboardLayout() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-card p-6 shadow-md flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Package className="h-7 w-7 text-primary" />
          <h2 className="text-2xl font-bold text-primary">E-POST</h2>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-md font-medium transition ${
                isActive
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`
            }
          >
            <Home className="h-5 w-5" />
            Dashboard
          </NavLink>

          <NavLink
            to="/dashboard/parcels"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-md font-medium transition ${
                isActive
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`
            }
          >
            <Package className="h-5 w-5" />
            Parcels
          </NavLink>

          <NavLink
            to="/dashboard/tracking"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-md font-medium transition ${
                isActive
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`
            }
          >
            <Search className="h-5 w-5" />
            Tracking
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="mt-8 border-t border-border pt-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-primary"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-h-0 min-w-0">
        {/* Top Header */}
        <header className="flex items-center justify-end p-4 border-b border-border bg-background gap-4">
          {/* Theme toggle to the left of profile */}
          <ModeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/user.jpg" alt={currentUser?.name || "User"} />
                  <AvatarFallback>
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
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser?.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{currentUser?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
