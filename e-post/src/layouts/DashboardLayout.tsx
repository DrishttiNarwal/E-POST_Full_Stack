// import { Outlet } from "react-router-dom";
// import { DashboardSidebar } from "../components/dashboard/DashboardSidebar";
// import { DashboardHeader } from "../components/dashboard/DashboardHeader";

// export default function DashboardLayout() {
//   return (
//     <div className="flex h-screen w-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
//       {/* Sidebar */}
//       <DashboardSidebar />
//       {/* Main Area */}
//       <div className="flex flex-1 flex-col min-h-0 min-w-0 md:ml-64">
//         <DashboardHeader />
//         <main className="flex-1 p-4 md:p-6 overflow-auto min-w-0">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }
//------------------------------------------------------------------------------------------------

import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth-provider";
import { LogOut, Package, Search, Home } from "lucide-react";
import { Button } from "../components/ui/button";

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 dark:bg-gray-900 p-6 shadow-md flex flex-col justify-between">
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
        <div className="mt-8 border-t pt-4">
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

      {/* Main Area */}
      <div className="flex flex-1 flex-col min-h-0 min-w-0">
        <main className="flex-1 p-4 md:p-6 overflow-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
