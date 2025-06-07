import React from "react"; 
import { useState } from "react"; 
import { Link, useLocation } from "react-router-dom"; 
import { cn } from "../../lib/utils"; 
import { Button } from "../ui/button"; 
import { ScrollArea } from "../ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useAuth } from "../auth-provider"; 
import {
  Package,
  Boxes,
  Search,
  BarChart3,
  Users,
  Building2,
  Menu,
  Home,
  LogOut,
} from "lucide-react"; // Icons

// --- Navigation Item Definition ---
interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[]; // Roles that can see this item
}

// --- Navigation Configuration ---
// Keep this configuration easily accessible
const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: Home, roles: ["admin", "staff", "customer"]},
  { title: "Parcels", href: "/dashboard/parcels", icon: Package, roles: ["admin", "staff", "customer"] },
  { title: "Containers", href: "/dashboard/containers", icon: Boxes, roles: ["admin", "staff"] },
  { title: "Tracking", href: "/dashboard/tracking", icon: Search, roles: ["admin", "staff", "customer"] },
  { title: "Staff Management", href: "/dashboard/admin/staff", icon: Users, roles: ["admin"] },
  { title: "Branch Management", href: "/dashboard/admin/branches", icon: Building2, roles: ["admin"] },
  { title: "Reports & Analytics", href: "/dashboard/admin/reports", icon: BarChart3, roles: ["admin"] },
];

// --- Main Sidebar Component (Handles Responsiveness) ---
export function DashboardSidebar() {
  const [open, setOpen] = useState(false); // State for mobile sheet visibility
  const location = useLocation(); // Hook to get current route path
  const { currentUser, logout } = useAuth(); // Get user info and logout function

  // Filter navigation items based on the current user's role
  const filteredNavItems = navItems.filter(
    (item) => currentUser && item.roles.includes(currentUser.role) // Ensure user exists and role matches
  );

  // Handler for logout to potentially add more logic if needed
  const handleLogout = () => {
    // The logout function from useAuth should handle token removal, state update, etc.
    logout();
    // Optional: Close mobile sheet if open
    setOpen(false);
  };

  return (
    <>
      {/* Mobile Sidebar Trigger and Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {/* Button visible only on mobile (md:hidden) */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed left-4 top-[0.8rem] z-40 h-9 w-9" // Adjusted top positioning slightly
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64"> {/* Explicit width */}
          {/* Mobile Sidebar Content */}
          <MobileSidebar
            items={filteredNavItems}
            pathname={location.pathname}
            setOpen={setOpen}
            onLogout={handleLogout}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar (Visible from md breakpoint up) */}
      <aside className="hidden md:flex h-screen w-64 flex-col fixed inset-y-0 z-30 border-r bg-background"> {/* Use theme background */}
        {/* Desktop Sidebar Content */}
        <DesktopSidebar
          items={filteredNavItems}
          pathname={location.pathname}
          onLogout={handleLogout}
        />
      </aside>

      {/* Placeholder div to push main content right on desktop */}
      {/* Note: Ensure your main layout component also respects this padding */}
      {/* Consider managing layout shifts via CSS in the parent layout */}
       {/* <div className="md:pl-64"></div> REMOVED - Layout padding should be handled by the parent DashboardLayout component */}
    </>
  );
}

// --- Props Interfaces for Sidebar Content Components ---
interface SidebarProps {
  items: NavItem[];
  pathname: string;
  onLogout: () => void;
}

interface MobileSidebarProps extends SidebarProps {
  setOpen: (open: boolean) => void;
}

// --- Mobile Sidebar Content Component ---
function MobileSidebar({
  items,
  pathname,
  setOpen,
  onLogout,
}: MobileSidebarProps) {
  return (
    // Using theme background and foreground
    <div className="flex h-full flex-col bg-background text-foreground">
      {/* Header/Logo Section */}
      <div className="flex h-14 items-center border-b px-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-semibold text-primary" // Use primary color for link
          onClick={() => setOpen(false)} // Close sheet on logo click
        >
          <Package className="h-6 w-6" />
          <span>E-POST</span> {/* Example Name */}
        </Link>
      </div>
      {/* Scrollable Navigation Area */}
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)} // Close sheet on link click
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", // Adjusted styling
                pathname === item.href && "bg-muted text-primary" // Active link styling
              )}
            >
              <item.icon className="h-4 w-4" /> {/* Consistent icon size */}
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      {/* Logout Button Area */}
      <div className="mt-auto border-t p-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-primary" // Consistent styling
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" /> {/* Consistent icon size */}
          Logout
        </Button>
      </div>
    </div>
  );
}

// --- Desktop Sidebar Content Component ---
function DesktopSidebar({ items, pathname, onLogout }: SidebarProps) {
  return (
     // Using theme background and foreground
    <div className="flex h-full flex-col bg-background text-foreground">
      {/* Header/Logo Section */}
      <div className="flex h-14 items-center border-b px-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-semibold text-primary" // Use primary color for link
        >
          <Package className="h-6 w-6" />
          <span>E-POST</span> {/* Example Name */}
        </Link>
      </div>
      {/* Scrollable Navigation Area */}
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                 "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", // Adjusted styling
                 pathname === item.href && "bg-muted text-primary" // Active link styling
              )}
            >
              <item.icon className="h-4 w-4" /> {/* Consistent icon size */}
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      {/* Logout Button Area */}
      <div className="mt-auto border-t p-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-primary" // Consistent styling
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" /> {/* Consistent icon size */}
          Logout
        </Button>
      </div>
    </div>
  );
}