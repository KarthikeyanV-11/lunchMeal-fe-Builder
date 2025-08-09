import { Navigation } from "./Navigation";
import { useAuth } from "../../contexts/AuthContext";

export const Layout = ({ children, showNavigation = true }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && showNavigation && <Navigation />}
      <main className="flex-1">{children}</main>
    </div>
  );
};
