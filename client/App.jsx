// import "./global.css";

// import { Toaster } from "@/components/ui/toaster";
// import { createRoot } from "react-dom/client";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./contexts/AuthContext";
// import { MenuProvider } from "./contexts/MenuContext";
// import RoleSelection from "./pages/RoleSelection";
// import EmployeeDashboard from "./pages/employee/Dashboard";
// import AdminDashboard from "./pages/admin/Dashboard";
// import FinanceDashboard from "./pages/finance/Dashboard";
// import EmployeeCalendar from "./pages/employee/Calendar";
// import AdminCalendar from "./pages/admin/Calendar";
// import FinanceCalendar from "./pages/finance/Calendar";
// import MenuDisplay from "./pages/shared/MenuDisplay";
// import NotFound from "./pages/NotFound";
// import Unauthorized from "./pages/Unauthorized";
// import { PlaceholderPage } from "./components/shared/PlaceholderPage";
// import Login from "./pages/Login";

// const queryClient = new QueryClient();

// // Protected Route Component
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { role, isAuthenticated } = useAuth();

//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   if (role && !allowedRoles.includes(role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return <>{children}</>;
// };

// // Home Route Component
// const HomeRoute = () => {
//   const { isAuthenticated, role } = useAuth();

//   if (isAuthenticated && role) {
//     return <Navigate to={`/${role}`} replace />;
//   }

//   return <RoleSelection />;
// };

// // Main App Routes Component
// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<HomeRoute />} />
//       <Route path="/unauthorized" element={<Unauthorized />} />

//       {/* Employee Routes */}
//       <Route
//         path="/employee"
//         element={
//           <ProtectedRoute allowedRoles={["employee"]}>
//             <EmployeeDashboard />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/employee/calendar"
//         element={
//           <ProtectedRoute allowedRoles={["employee"]}>
//             <EmployeeCalendar />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/employee/subscription"
//         element={
//           <ProtectedRoute allowedRoles={["employee"]}>
//             <PlaceholderPage
//               title="Subscription Management"
//               description="Manage your lunch subscription settings and preferences."
//             />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/employee/notifications"
//         element={
//           <ProtectedRoute allowedRoles={["employee"]}>
//             <PlaceholderPage
//               title="Notifications"
//               description="View your lunch-related notifications and alerts."
//             />
//           </ProtectedRoute>
//         }
//       />

//       {/* Admin Routes */}
//       <Route
//         path="/admin"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <AdminDashboard />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/calendar"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <AdminCalendar />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/employees"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <PlaceholderPage
//               title="Employee Management"
//               description="Manage employee subscriptions and preferences."
//             />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/menu-upload"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <PlaceholderPage
//               title="Menu Upload"
//               description="Upload and manage lunch menus for different dates."
//             />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/reports"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <PlaceholderPage
//               title="Reports"
//               description="View detailed reports and analytics on lunch subscriptions."
//             />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/notifications"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <PlaceholderPage
//               title="Notification Management"
//               description="Create and manage notification templates and alerts."
//             />
//           </ProtectedRoute>
//         }
//       />

//       {/* Finance Routes */}
//       <Route
//         path="/finance"
//         element={
//           <ProtectedRoute allowedRoles={["finance"]}>
//             <FinanceDashboard />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/finance/calendar"
//         element={
//           <ProtectedRoute allowedRoles={["finance"]}>
//             <FinanceCalendar />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/finance/payroll"
//         element={
//           <ProtectedRoute allowedRoles={["finance"]}>
//             <PlaceholderPage
//               title="Payroll Export"
//               description="Export payroll data for lunch subscription deductions."
//             />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/finance/reconciliation"
//         element={
//           <ProtectedRoute allowedRoles={["finance"]}>
//             <PlaceholderPage
//               title="Reconciliation"
//               description="Manage monthly financial reconciliation for lunch subscriptions."
//             />
//           </ProtectedRoute>
//         }
//       />

//       {/* Menu Display Route */}
//       <Route
//         path="/menu/:role/:selectedDate"
//         element={
//           <ProtectedRoute allowedRoles={["employee", "admin", "finance"]}>
//             <MenuDisplay />
//           </ProtectedRoute>
//         }
//       />
//       <Route path="/login/:role" element={<Login />} />

//       {/* 404 Route */}
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <AuthProvider>
//         <MenuProvider>
//           <Toaster />
//           <Sonner />
//           <BrowserRouter>
//             <AppRoutes />
//           </BrowserRouter>
//         </MenuProvider>
//       </AuthProvider>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// createRoot(document.getElementById("root")).render(<App />);

import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MenuProvider } from "./contexts/MenuContext";

import RoleSelection from "./pages/RoleSelection";
import EmployeeDashboard from "./pages/employee/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import FinanceDashboard from "./pages/finance/Dashboard";
import EmployeeCalendar from "./pages/employee/Calendar";
import AdminCalendar from "./pages/admin/Calendar";
import FinanceCalendar from "./pages/finance/Calendar";
import MenuDisplay from "./pages/shared/MenuDisplay";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import { PlaceholderPage } from "./components/shared/PlaceholderPage";
import Login from "./pages/Login";
import store from "./store";

const queryClient = new QueryClient();

// Home Route Component
const HomeRoute = () => {
  return <RoleSelection />;
};

// Main App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomeRoute />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Employee Routes (No Auth) */}
      <Route path="/employee" element={<EmployeeDashboard />} />
      <Route path="/employee/calendar" element={<EmployeeCalendar />} />
      <Route
        path="/employee/subscription"
        element={
          <PlaceholderPage
            title="Subscription Management"
            description="Manage your lunch subscription settings and preferences."
          />
        }
      />
      <Route
        path="/employee/notifications"
        element={
          <PlaceholderPage
            title="Notifications"
            description="View your lunch-related notifications and alerts."
          />
        }
      />

      {/* Admin Routes (No Auth) */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/calendar" element={<AdminCalendar />} />
      <Route
        path="/admin/employees"
        element={
          <PlaceholderPage
            title="Employee Management"
            description="Manage employee subscriptions and preferences."
          />
        }
      />
      <Route
        path="/admin/menu-upload"
        element={
          <PlaceholderPage
            title="Menu Upload"
            description="Upload and manage lunch menus for different dates."
          />
        }
      />
      <Route
        path="/admin/reports"
        element={
          <PlaceholderPage
            title="Reports"
            description="View detailed reports and analytics on lunch subscriptions."
          />
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <PlaceholderPage
            title="Notification Management"
            description="Create and manage notification templates and alerts."
          />
        }
      />

      {/* Finance Routes (No Auth) */}
      <Route path="/finance" element={<FinanceDashboard />} />
      <Route path="/finance/calendar" element={<FinanceCalendar />} />
      <Route
        path="/finance/payroll"
        element={
          <PlaceholderPage
            title="Payroll Export"
            description="Export payroll data for lunch subscription deductions."
          />
        }
      />
      <Route
        path="/finance/reconciliation"
        element={
          <PlaceholderPage
            title="Reconciliation"
            description="Manage monthly financial reconciliation for lunch subscriptions."
          />
        }
      />

      {/* Menu Display Route */}
      <Route path="/menu/:role/:selectedDate" element={<MenuDisplay />} />

      {/* Login */}
      <Route path="/login/:role" element={<Login />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <MenuProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </MenuProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
