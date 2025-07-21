import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Check localStorage for existing role on app start
    const savedRole = localStorage.getItem("lunchapp_role");
    if (savedRole && ["employee", "admin", "finance"].includes(savedRole)) {
      setRole(savedRole);
    }
  }, []);

  const login = (userRole) => {
    setRole(userRole);
    localStorage.setItem("lunchapp_role", userRole);
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem("lunchapp_role");
  };

  const isAuthenticated = role !== null;

  return (
    <AuthContext.Provider value={{ role, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
