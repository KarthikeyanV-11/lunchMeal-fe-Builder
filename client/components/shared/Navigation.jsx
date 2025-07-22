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
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { clearUser } from "../../slice/authSlice";

const navigationConfig = {
  employee: [
    { href: "/employee", label: "Dashboard", icon: Home },
    { href: "/employee/calendar", label: "Calendar", icon: Calendar },
    { href: "/employee/subscription", label: "Subscription", icon: FileText },
    { href: "/employee/notifications", label: "Notifications", icon: Bell },
  ],
  admin: [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/calendar", label: "Calendar", icon: Calendar },
    { href: "/admin/employees", label: "Employee Mgmt", icon: Users },
    { href: "/admin/menu-upload", label: "Menu Upload", icon: Upload },
    { href: "/admin/reports", label: "Reports", icon: BarChart },
    { href: "/admin/notifications", label: "Notifications", icon: Bell },
  ],
  finance: [
    { href: "/finance", label: "Dashboard", icon: Home },
    { href: "/finance/calendar", label: "Calendar", icon: Calendar },
    { href: "/finance/payroll", label: "Payroll Export", icon: DollarSign },
    {
      href: "/finance/reconciliation",
      label: "Reconciliation",
      icon: FileText,
    },
  ],
};

export const Navigation = () => {
  const { role, logout } = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!role) return null;

  const links = navigationConfig[role];

  function handleLogout() {
    dispatch(clearUser());
    navigate("/");
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">
              LunchApp
            </Link>
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
              onClick={handleLogout}
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
