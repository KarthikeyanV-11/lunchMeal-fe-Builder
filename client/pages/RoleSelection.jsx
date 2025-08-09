import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Users, Shield, DollarSign } from "lucide-react";

const roles = [
  {
    type: "employee",
    title: "Employee",
    description:
      "View menus, manage subscriptions, and track your lunch preferences",
    icon: Users,
    color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
  },
  {
    type: "admin",
    title: "Admin/HR",
    description:
      "Manage employees, upload menus, and handle subscription administration",
    icon: Shield,
    color: "bg-green-50 hover:bg-green-100 border-green-200",
  },
  {
    type: "payroll",
    title: "Payroll",
    description:
      "Handle payroll exports, reconciliation, and financial reporting",
    icon: DollarSign,
    color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
  },
];

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/login/${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Welcome to ICMeal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your comprehensive lunch subscription management platform. Choose
            your role to access personalized features and dashboard.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.type}
                className={`transition-all duration-300 hover:shadow-xl cursor-pointer ${role.color}`}
                onClick={() => handleRoleSelect(role.type)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-white rounded-full shadow-lg">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {role.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                    {role.description}
                  </CardDescription>
                  <Button
                    className="w-full font-semibold py-2 px-4 rounded-lg shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSelect(role.type);
                    }}
                  >
                    Login as {role.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Secure role-based access to ensure data privacy and appropriate
            functionality for each user type.
          </p>
        </div>
      </div>
    </div>
  );
}
