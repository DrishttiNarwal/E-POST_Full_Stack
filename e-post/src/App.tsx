import React from "react"; 
import { Routes, Route, Navigate, Outlet } from "react-router-dom"; 
import { useAuth } from "./components/auth-provider"; 
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardLayout from "./layouts/DashboardLayout"; 
import DashboardPage from "./pages/DashboardPage";
import ParcelsPage from "./pages/ParcelsPage";
import ContainersPage from "./pages/ContainersPage";
import TrackingPage from "./pages/TrackingPage";
import StaffPage from "./pages/admin/StaffPage";
import BranchesPage from "./pages/admin/BranchesPage";
import ReportsPage from "./pages/admin/ReportsPage";
import Home from "./pages/Home"
import NotFoundPage from "./pages/NotFoundPage";

// --- Protected Route Component ---
const ProtectedRoute = ({children, allowedRoles = []}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const auth = useAuth(); 

  const { currentUser, isLoading } = auth;

  // Display loading state while auth status is being determined
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading Session...
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!currentUser) {
    // Using 'replace' prevents the user from going back to the protected route
    // after logging in by pressing the back button.
    // 'state' can optionally pass information to the login page (e.g., intended destination)
    return <Navigate to="/" replace />;
  }

  // Check for role-based authorization if allowedRoles are specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect to a default authorized page (e.g., dashboard) or an 'Unauthorized' page
    // if the user's role doesn't match.
    // Redirecting to '/dashboard' might be suitable if all authenticated users can see it.
    // Consider creating a dedicated '/unauthorized' page for clarity.
    return <Navigate to="/dashboard" replace />; 
  }

  // Render the child components if authenticated and authorized
  return <>{children}</>;
};

// --- Main App Component ---
// This uses standard react-router-dom v6 routing.
function App() {
  return (
    <Routes>
      {/* Public routes accessible without login */}
      <Route path="/" element={<Home />} />
      
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes - User must be logged in */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {/* Ensures user is logged in to access anything under /dashboard */}
            <DashboardLayout />
            
            {/* The layout wraps all nested dashboard routes */}
          </ProtectedRoute>
        }
      >
        {/* Index route for the dashboard - defaults to DashboardPage */}
        {/* Rendered inside DashboardLayout's <Outlet /> */}
        <Route index element={<DashboardPage />} />

        {/* Other general dashboard routes */}
        {/* Rendered inside DashboardLayout's <Outlet /> */}
        <Route path="parcels" element={<ParcelsPage />} />
        <Route path="tracking" element={<TrackingPage />} />

        {/* Routes requiring specific roles (admin or staff) */}
        {/* Rendered inside DashboardLayout's <Outlet /> */}
        <Route
          path="containers"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <ContainersPage />
            </ProtectedRoute>
          }
        />

        {/* Admin-specific routes - nested under /dashboard/admin */}
        {/* Rendered inside DashboardLayout's <Outlet /> */}
        <Route
          path="admin/staff"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              {/* Ensures only admin */}              
              <StaffPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/branches"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <BranchesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              {/* Ensures only admin */}
              <ReportsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Optional: Catch-all route for 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

// -----------------------------------------------------------------------------------

// import React from "react"; 
// import { Routes, Route, Navigate } from "react-router-dom"; 
// // import { useAuth } from "./components/auth-provider"; // TEMPORARILY NOT NEEDED
// import LoginPage from "./pages/LoginPage";
// import SignupPage from "./pages/SignupPage";
// import DashboardLayout from "./layouts/DashboardLayout"; 
// import DashboardPage from "./pages/DashboardPage";
// import ParcelsPage from "./pages/ParcelsPage";
// import ContainersPage from "./pages/ContainersPage";
// import TrackingPage from "./pages/TrackingPage";
// import StaffPage from "./pages/admin/StaffPage";
// import BranchesPage from "./pages/admin/BranchesPage";
// import ReportsPage from "./pages/admin/ReportsPage";
// import NotFoundPage from "./pages/NotFoundPage";

// // --- TEMP: Bypass ProtectedRoute ---
// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   return <>{children}</>; // Skip auth checks for now
// };

// function App() {
//   return (
//     <Routes>
//       {/* TEMP: Default route redirects to dashboard */}
//       <Route path="/" element={<Navigate to="/dashboard" replace />} />

//       {/* Still keep signup/login if needed later */}
//       <Route path="/signup" element={<SignupPage />} />
//       <Route path="/login" element={<LoginPage />} />

//       {/* Dashboard routes (no auth check now) */}
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<DashboardPage />} />
//         <Route path="parcels" element={<ParcelsPage />} />
//         <Route path="tracking" element={<TrackingPage />} />
//         <Route path="containers" element={<ContainersPage />} />
//         <Route path="admin/staff" element={<StaffPage />} />
//         <Route path="admin/branches" element={<BranchesPage />} />
//         <Route path="admin/reports" element={<ReportsPage />} />
//       </Route>

//       <Route path="*" element={<NotFoundPage />} />
//     </Routes>
//   );
// }

// export default App;
