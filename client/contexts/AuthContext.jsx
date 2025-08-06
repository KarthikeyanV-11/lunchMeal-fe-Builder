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

//for later
// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";
// import { useDispatch } from "react-redux";
// import {
//   setUser as setUserRedux,
//   clearUser as clearUserRedux,
// } from "@/slice/authSlice";

// const VALID_ROLES = ["employee", "admin", "payroll"];
// const AuthContext = createContext(undefined);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState(null);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         if (parsedUser?.role && VALID_ROLES.includes(parsedUser.role)) {
//           setUser(parsedUser);
//           setRole(parsedUser.role);
//           dispatch(setUserRedux(parsedUser)); // Sync Redux on init
//         } else {
//           localStorage.removeItem("user");
//         }
//       } catch (error) {
//         console.error("Error parsing stored user:", error);
//         localStorage.removeItem("user");
//       }
//     }
//   }, [dispatch]);

//   const login = useCallback(
//     (userData) => {
//       if (!userData?.role || !VALID_ROLES.includes(userData.role)) {
//         throw new Error("Invalid user role");
//       }

//       localStorage.setItem("user", JSON.stringify(userData));
//       setUser(userData);
//       setRole(userData.role);
//       dispatch(setUserRedux(userData)); // Sync Redux
//     },
//     [dispatch],
//   );

//   const logout = useCallback(() => {
//     localStorage.removeItem("user");
//     setUser(null);
//     setRole(null);
//     dispatch(clearUserRedux()); // Sync Redux
//   }, [dispatch]);

//   const isAuthenticated = !!user;

//   return (
//     <AuthContext.Provider
//       value={{ user, role, isAuthenticated, login, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
