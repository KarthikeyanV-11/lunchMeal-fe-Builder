// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useDispatch } from "react-redux";
// import { setUser } from "../slice/authSlice";

// export default function Login() {
//   const { role } = useParams();
//   const navigate = useNavigate();
//   const { login } = useAuth(); // ✅ Get login function from context
//   const dispatch = useDispatch();

//   const [employeeCode, setEmployeeCode] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await fetch(
//         "http://192.168.3.121:8080/api/v1/employee/getAllEmployees", //get all employees
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           // body: JSON.stringify({ employeeCode, password, role }),
//         },
//       );

//       const data = await res.json();

//       if (data.success) {
//         // localStorage.setItem("token", data.token);

//         // dispatch(
//         //   setUser({
//         //     name: data.name,
//         //     role: role,
//         //     code: employeeCode,
//         //   }),
//         // );
//         console.log(data);
//         // login(role); // ✅ This updates the context (required for ProtectedRoute)
//         // navigate(`/${role}`);
//       } else {
//         // setError(data.message || "Invalid credentials. Please try again.");
//         console.log(data);
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Server error. Please try again later.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-center capitalize">
//             Login as {role}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               placeholder="Employee Code"
//               value={employeeCode}
//               onChange={(e) => setEmployeeCode(e.target.value)}
//               // required
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               // required
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {error && <p className="text-red-500 text-sm">{error}</p>}
//             <Button type="submit" className="w-full">
//               Login
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

//temp for now
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // Ensure this is the correct path

const Login = () => {
  const { role } = useParams(); // role from the route: /login/:role
  const navigate = useNavigate();
  const { login } = useAuth(); // use login from context

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // TEMP login (no actual auth check)
    if (["employee", "admin", "payroll"].includes(role)) {
      login(role); // Set role in context + localStorage
      navigate(`/${role}`); // Navigate to dashboard of the role
    } else {
      alert("Invalid role in URL");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2 style={{ marginBottom: "1rem" }}>
        Login as <strong>{role}</strong>
      </h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Username:</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ display: "block", width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Password:</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: "block", width: "100%" }}
          />
        </div>

        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
