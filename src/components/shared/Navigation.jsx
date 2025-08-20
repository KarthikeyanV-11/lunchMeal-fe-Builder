import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  Home,
  Calendar,
  Users,
  FileText,
  DollarSign,
  Bell,
  Upload,
  BarChart,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/Button";
import { useDispatch } from "react-redux";
import { clearUser } from "../../slice/authSlice";
import { toast } from "react-hot-toast";

const navigationConfig = {
  employee: [
    { href: "/employee", label: "Dashboard", icon: Home },
    { href: "/employee/calendar", label: "Calendar", icon: Calendar },
    // { href: "/employee/subscription", label: "Subscription", icon: FileText },
    // { href: "/employee/notifications", label: "Notifications", icon: Bell },
  ],
  admin: [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/calendar", label: "Calendar", icon: Calendar },
    { href: "/admin/menu-upload", label: "Menu Upload", icon: Upload },
    { href: "/admin/employees", label: "Employee Mgt", icon: Users },
    {
      href: "/admin/notifications",
      label: "Notification Mgt",
      icon: Bell,
    },
    { href: "/admin/reports", label: "Reports", icon: BarChart },
  ],
  payroll: [
    { href: "/payroll", label: "Dashboard", icon: Home },
    { href: "/payroll/calendar", label: "Calendar", icon: Calendar },
    { href: "/payroll/payroll", label: "Payroll Export", icon: DollarSign },
    {
      href: "/payroll/reconciliation",
      label: "Reconciliation",
      icon: FileText,
    },
  ],
  vendor: [
    { href: "/vendor", label: "Calendar", icon: Calendar },
    { href: "/vendor/menu-upload", label: "Menu Upload", icon: Upload },
  ],
};

export const Navigation = () => {
  const { role, logout } = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!role) return null;

  // const links = navigationConfig[role];
  const links = navigationConfig[role] || [];

  function handleLogout() {
    logout();
    dispatch(clearUser());
    navigate("/");
    toast.success("Logged out successfully");
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span
              onClick={() => {
                toast.custom((t) => (
                  <div className="flex items-center justify-between w-full max-w-sm p-4 bg-orange-50 border border-orange-200 rounded-lg shadow-lg animate-enter">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-orange-700">
                        Navigate to Homepage?
                      </span>
                      <span className="text-xs text-orange-600 mt-1">
                        This will take you to the landing page. Continue?
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => {
                          toast.dismiss(t.id);
                          navigate("/");
                        }}
                        className="bg-orange-600 text-white text-xs px-3 py-1 rounded hover:bg-orange-700 transition"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => toast.dismiss(t.id)}
                        className="text-orange-600 text-xs px-3 py-1 border border-orange-300 rounded hover:bg-orange-100 transition"
                      >
                        No
                      </button>
                    </div>
                  </div>
                ));
              }}
              className="text-xl font-bold text-primary cursor-pointer"
            >
              ICMeal
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-blue-50"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 capitalize">{role}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                toast.custom((t) => (
                  <div className="flex items-center justify-between w-full max-w-sm p-4 bg-orange-50 border border-orange-200 rounded-lg shadow-lg animate-enter">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-orange-700">
                        Are you sure you want to logout?
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => {
                          toast.dismiss(t.id); // Close toast immediately
                          setTimeout(() => {
                            handleLogout(); // Then call logout logic
                          }, 0);
                        }}
                        className="bg-orange-600 text-white text-xs px-3 py-1 rounded hover:bg-orange-700 transition"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => toast.dismiss(t.id)} // Just close toast on No
                        className="text-orange-600 text-xs px-3 py-1 border border-orange-300 rounded hover:bg-orange-100 transition"
                      >
                        No
                      </button>
                    </div>
                  </div>
                ));
              }}
              className="flex items-center space-x-1"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;

            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary bg-blue-50"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
