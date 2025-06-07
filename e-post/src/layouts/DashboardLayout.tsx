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
//-------------------------------------------------------------------------------------
import { Outlet, NavLink } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen w-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 dark:bg-gray-900 p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-primary">E-POST</h2>
        <nav className="flex flex-col gap-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md font-medium ${
                isActive ? "bg-primary text-white" : "text-muted-foreground hover:bg-accent"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/dashboard/parcels"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md font-medium ${
                isActive ? "bg-primary text-white" : "text-muted-foreground hover:bg-accent"
              }`
            }
          >
            Parcels
          </NavLink>

          <NavLink
            to="/dashboard/tracking"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md font-medium ${
                isActive ? "bg-primary text-white" : "text-muted-foreground hover:bg-accent"
              }`
            }
          >
            Tracking
          </NavLink>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex flex-1 flex-col min-h-0 min-w-0">
        {/* Optionally keep the header here */}
        {/* <DashboardHeader /> */}

        <main className="flex-1 p-4 md:p-6 overflow-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

