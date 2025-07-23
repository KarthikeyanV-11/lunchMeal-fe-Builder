import { Layout } from "@/components/shared/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, CreditCard, Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EmployeeDashboard() {
  //reading the redux state values
  const user = useSelector((state) => state.auth.user);

  //for getting the subscription status from the backend
  const [isActive, setIsActive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const token = localStorage.getItem("authToken"); // or from context

        const res = await axios.get("/api/subscription", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Access the `active` field from the response
        setIsActive(res.data.active);
      } catch (err) {
        console.error("Error fetching subscription status", err);
        setIsActive(false); // fallback to not active
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, []);

  // Shared date values for days part
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  const monthName = today.toLocaleString("default", { month: "long" });

  // 1. Get total working days in a month
  function getWorkingDaysInMonth(year, month) {
    let workingDays = 0;
    const date = new Date(year, month, 1); // month is 0-indexed

    while (date.getMonth() === month) {
      const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      if (day >= 1 && day <= 5) {
        workingDays++;
      }
      date.setDate(date.getDate() + 1);
    }

    return workingDays;
  }

  // 2. Calculate total cost
  function calculateMonthlyCost(year, month) {
    const workingDays = getWorkingDaysInMonth(year, month);

    const companyContribution = workingDays * 65;
    const employeeContribution = workingDays * 35;
    const total = workingDays * 100;

    return {
      workingDays,
      companyContribution,
      employeeContribution,
      total,
    };
  }

  const costDetails = calculateMonthlyCost(year, month);

  // 3. Calculate remaining working days from today
  function getRemainingWorkingDays(year, month, startDay) {
    let remainingWorkingDays = 0;
    const date = new Date(year, month, startDay);

    while (date.getMonth() === month) {
      const day = date.getDay();
      if (day >= 1 && day <= 5) {
        remainingWorkingDays++;
      }
      date.setDate(date.getDate() + 1);
    }

    return remainingWorkingDays;
  }

  const remainingWorkingDays = getRemainingWorkingDays(year, month, day);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome back, {user?.name || "John"}!
          </h1>
          <p className="text-lg text-gray-600">
            Here's your lunch subscription overview for this month.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subscription Status
              </CardTitle>

              {loading ? (
                <Badge variant="outline" className="text-gray-600">
                  Loading...
                </Badge>
              ) : (
                <Badge
                  variant="default"
                  className={
                    isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {isActive ? "Active" : "Not Active"}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {monthName} {year}
              </div>
              <p className="text-xs text-muted-foreground">
                Valid till month end
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Cost
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹ {costDetails.total}</div>
              <p className="text-xs text-muted-foreground">
                Company share: ₹ {costDetails.companyContribution}
              </p>
              <p className="text-xs text-muted-foreground font-bold">
                Employee share: ₹ {costDetails.employeeContribution}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Location</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Chennai</div>
              <p className="text-xs text-muted-foreground">Primary Location</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Days Remaining
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{remainingWorkingDays}</div>
              <p className="text-xs text-muted-foreground">Working days left</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Today's Menu</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-600">
                  • Sambar • Rasam • Phulka • Curd Rice
                </div>
                <div className="text-sm text-gray-600">
                  • Beetroot Poriyal • Appalam • Pickle
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm">Mark Had Lunch</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Recent Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">Menu updated for next week</p>
                  <p className="text-gray-500">2 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Subscription renewal reminder</p>
                  <p className="text-gray-500">1 day ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">New lunch vendor onboarded</p>
                  <p className="text-gray-500">3 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
