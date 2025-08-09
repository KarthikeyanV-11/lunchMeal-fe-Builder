import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { useDispatch } from "react-redux";
import { setUser } from "../slice/authSlice";

import axios from "axios";

export default function Login() {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  const { role: routeRole } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //HELPER FUNCTION
  const getFrontendRole = (backendRole) => {
    if (backendRole === "USER") return "employee";
    return backendRole.toLowerCase(); // admin/payroll/etc.
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   try {
  //     const res = await axios.post(
  //       `${BASE_URL}/login`,
  //       {
  //         employeeCode,
  //         password,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       },
  //     );

  //     const data = res.data;
  //     console.log(role);
  //     console.log(data.role);

  //     if (role === "employee") {
  //       role = "USER";
  //     }

  //     if (res.status === 200 && data && data.role) {
  //       if (data.role !== role) {
  //         setError("Unauthorized: Please log in from the correct portal.");
  //         localStorage.removeItem("user");
  //         return;
  //       }

  //       localStorage.setItem("user", JSON.stringify(data));
  //       login({ ...data });
  //       dispatch(setUser(data));

  //       navigate(`/${data.role}`); // ✅ Use actual role, not URL param
  //     } else {
  //       setError("Invalid credentials");
  //     }
  //   } catch (err) {
  //     console.error("Login error:", err);
  //     setError("Server error. Please try again later.");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        { employeeCode, password },
        { headers: { "Content-Type": "application/json" } },
      );

      const data = res.data;

      if (res.status === 200 && data && data.role) {
        const mappedRole = getFrontendRole(data.role);

        // Enforce portal-role match
        if (routeRole !== mappedRole) {
          setError("Unauthorized: Please log in from the correct portal.");
          localStorage.removeItem("user");
          return;
        }

        localStorage.setItem("user", JSON.stringify(data));
        login({ ...data });
        dispatch(setUser(data));

        navigate(`/${mappedRole}`); // Navigate to correct dashboard
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/lunch-bg.jpg')",
      }}
    >
      {/* Dark overlay to dim the background image */}
      <div className="absolute inset-0 bg-black opacity-65 z-0"></div>

      {/* Login Card */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <Card className="bg-transparent shadow-none border-none">
          <CardHeader>
            <CardTitle className="text-center capitalize text-orange-600 text-2xl font-bold">
              Login as {routeRole}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Employee Code Input */}
              <input
                type="text"
                placeholder="Employee Code"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                required
                className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              {/* Password Input */}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              {/* Error Message */}
              {error && <p className="text-red-600 text-sm">{error}</p>}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
