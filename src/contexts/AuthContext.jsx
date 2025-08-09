import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // NEW

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (["employee", "admin", "payroll"].includes(savedRole)) {
      setRole(savedRole);
    }
    setLoading(false); // mark as loaded
  }, []);

  const login = (userData) => {
    const roleValue =
      userData.role === "USER" ? "employee" : userData.role.toLowerCase();
    setRole(roleValue);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", roleValue);
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    // ❌ Don't navigate here
  };

  const isAuthenticated = role !== null;

  return (
    <AuthContext.Provider
      value={{ role, login, logout, isAuthenticated, loading }}
    >
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
