import "./global.css";

import { Toaster } from "react-hot-toast"; // ✅ Correct toaster import
import { createRoot } from "react-dom/client";
import { TooltipProvider } from "./components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { MenuProvider } from "./contexts/MenuContext";
import RoleSelection from "./pages/RoleSelection";
import EmployeeDashboard from "./pages/employee/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import PayrollDashboard from "./pages/payroll/Dashboard";
import EmployeeCalendar from "./pages/employee/Calendar";
import AdminCalendar from "./pages/admin/Calendar";
import PayrollCalendar from "./pages/payroll/Calendar";
import MenuDisplay from "./pages/shared/MenuDisplay";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import { PlaceholderPage } from "./components/shared/PlaceholderPage";
import Login from "./pages/Login";
import store from "./store";
import { Provider } from "react-redux";
import MenuUpload from "./pages/admin/menuUpload";
import EmployeeMgmt from "./pages/admin/EmployeeMgmt";

// Protected Route Component
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { role, isAuthenticated } = useAuth();

//   // if (!isAuthenticated) return <Navigate to="/" replace />;
//   // if (role && !allowedRoles.includes(role))
//   //   return <Navigate to="/unauthorized" replace />;

//   if (!isAuthenticated) return <Navigate to="/" replace />;
//   if (!role || !allowedRoles.includes(role))
//     return <Navigate to="/unauthorized" replace />;

//   return <>{children}</>;
// };

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role, isAuthenticated, loading } = useAuth();

  if (loading) return null; // Wait for localStorage read
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!role || !allowedRoles.includes(role))
    return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
};

// Home Route Component
// const HomeRoute = () => {
//   const { isAuthenticated, role } = useAuth();
//   if (isAuthenticated && role) return <Navigate to={`/${role}`} replace />;
//   return <RoleSelection />;
// };
const HomeRoute = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null; // Wait before deciding route

  if (isAuthenticated && role) return <Navigate to={`/${role}`} replace />;
  return <RoleSelection />;
};

// Main App Routes
const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<HomeRoute />} />
    <Route path="/unauthorized" element={<Unauthorized />} />

    {/* Employee Routes */}
    <Route
      path="/employee"
      element={
        <ProtectedRoute allowedRoles={["employee"]}>
          <EmployeeDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/employee/calendar"
      element={
        <ProtectedRoute allowedRoles={["employee"]}>
          <EmployeeCalendar />
        </ProtectedRoute>
      }
    />
    <Route
      path="/employee/subscription"
      element={
        <ProtectedRoute allowedRoles={["employee"]}>
          <PlaceholderPage
            title="Subscription Management"
            description="Manage your lunch subscription settings and preferences."
          />
        </ProtectedRoute>
      }
    />
    <Route
      path="/employee/notifications"
      element={
        <ProtectedRoute allowedRoles={["employee"]}>
          <PlaceholderPage
            title="Notifications"
            description="View your lunch-related notifications and alerts."
          />
        </ProtectedRoute>
      }
    />

    {/* Admin Routes */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/calendar"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminCalendar />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/employees"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          {/* <PlaceholderPage
            title="Employee Management"
            description="Manage employee subscriptions and preferences."
          /> */}
          <EmployeeMgmt />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/menu-upload"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          {/* <PlaceholderPage
            title="Menu Upload"
            description="Upload and manage lunch menus for different dates."
          /> */}
          <MenuUpload />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/reports"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <PlaceholderPage
            title="Reports"
            description="View detailed reports and analytics on lunch subscriptions."
          />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/notifications"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <PlaceholderPage
            title="Notification Management"
            description="Create and manage notification templates and alerts."
          />
        </ProtectedRoute>
      }
    />

    {/* Payroll Routes (formerly Finance) */}
    <Route
      path="/payroll"
      element={
        <ProtectedRoute allowedRoles={["payroll"]}>
          <PayrollDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/payroll/calendar"
      element={
        <ProtectedRoute allowedRoles={["payroll"]}>
          <PayrollCalendar />
        </ProtectedRoute>
      }
    />
    <Route
      path="/payroll/payroll"
      element={
        <ProtectedRoute allowedRoles={["payroll"]}>
          <PlaceholderPage
            title="Payroll Export"
            description="Export payroll data for lunch subscription deductions."
          />
        </ProtectedRoute>
      }
    />
    <Route
      path="/payroll/reconciliation"
      element={
        <ProtectedRoute allowedRoles={["payroll"]}>
          <PlaceholderPage
            title="Reconciliation"
            description="Manage monthly financial reconciliation for lunch subscriptions."
          />
        </ProtectedRoute>
      }
    />

    {/* Menu Display Route */}
    <Route
      path="/menu/:role/:selectedDate"
      element={
        <ProtectedRoute allowedRoles={["employee", "admin", "payroll"]}>
          <MenuDisplay />
        </ProtectedRoute>
      }
    />

    {/* Login */}
    <Route path="/login/:role" element={<Login />} />

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

// App component with providers
const App = () => (
  <TooltipProvider>
    <AuthProvider>
      <MenuProvider>
        <BrowserRouter basename="/icmeal">
          <AppRoutes />
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2000,
            style: {
              marginTop: "50px",
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </MenuProvider>
    </AuthProvider>
  </TooltipProvider>
);

// Render root
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
