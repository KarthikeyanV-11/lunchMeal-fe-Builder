import { Layout } from "@/components/shared/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setEmployees,
  setMoneyContributions,
  setSubscribedEmployees,
  setWorkingDaysStats,
} from "../../slice/employeeSlice";
import { useEffect } from "react";
import axios from "axios";

export default function PayrollDashboard() {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleString("default", { month: "long" });
  console.log(monthName);

  //REDUX RELATED
  const dispatch = useDispatch();

  const DaysRelated = useSelector((state) => state.employee.workingDaysStats);
  const workingDays = DaysRelated.workingDays;
  const remainingDays = DaysRelated.remainingWorkingDays;

  const moneyContributions = useSelector(
    (state) => state.employee.moneyContributions,
  );
  const employeeContribution = moneyContributions.employeeContribution;
  const managementContribution = moneyContributions.managementContribution;
  const totalContribution = moneyContributions.totalContribution;

  // FINDING OUT THE TOTAL STRENGTH
  const employeeStrength = useSelector(
    (state) => state.employee.allEmployees.length,
  );

  //FINDING OUT THE TOTAL SUBSCRIBED EMPLOYEES
  const subscribersStrength = useSelector(
    (state) => state.employee.subscribedEmployees.length,
  );

  const percentOfsubscribedEmployeesFromTotal =
    employeeStrength > 0
      ? +((subscribersStrength / employeeStrength) * 100).toFixed(2)
      : 0;
  console.log(
    employeeStrength,
    subscribersStrength,
    percentOfsubscribedEmployeesFromTotal,
  );

  // ✅ Total contributions for all subscribed employees
  const totalEmployeeContribution = subscribersStrength * employeeContribution;
  const totalManagementContribution =
    subscribersStrength * managementContribution;
  const totalCombinedContribution = subscribersStrength * totalContribution;

  // ✅ Average daily contributions
  const averageDailyEmployeeCost =
    workingDays > 0 ? (totalEmployeeContribution / workingDays).toFixed(2) : 0;

  const averageDailyManagementCost =
    workingDays > 0
      ? (totalManagementContribution / workingDays).toFixed(2)
      : 0;

  const averageDailyTotalCost =
    workingDays > 0 ? (totalCombinedContribution / workingDays).toFixed(2) : 0;

  //USE EFFECTS

  //monthly expense
  useEffect(() => {
    async function fetchMonthlyExpensePerEmployee() {
      try {
        const res = await axios.get(
          `${BASE_URL}/payroll/monthlyExpensePerEmployee?month=${month + 1}&year=${year}`,
        );
        console.log(res.data);
        dispatch(setMoneyContributions(res.data));
      } catch (error) {
        console.error(error);
      }
    }
    fetchMonthlyExpensePerEmployee();
  }, []);

  //working days
  useEffect(() => {
    async function fetchWorkingDays() {
      try {
        const res = await axios.get(
          `${BASE_URL}/getWorkingDaysDetails?year=${year}&month=${month + 1}`,
        );
        console.log(res.data);
        dispatch(setWorkingDaysStats(res.data));
      } catch (error) {
        console.error(error);
      }
    }
    fetchWorkingDays();
  }, []);

  //all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/employee/getAllEmployees`, // url for fetching all the employee details
        );

        const employeesArray = response.data;
        // console.log(employeesArray[0]); getting the first user

        dispatch(setEmployees(employeesArray));
      } catch (error) {
        console.error("Error fetching employees:", error.message);
      }
    };

    fetchEmployees();
  }, [dispatch]);

  //subscribed employees
  useEffect(() => {
    async function fetchTotalSubscribers() {
      try {
        const res = await axios.get(
          `${BASE_URL}/subscription/active?month=${month + 1}&year=${year}`,
        );
        dispatch(setSubscribedEmployees(res.data));
        console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTotalSubscribers();
  }, [dispatch]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Payroll Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage payroll exports and financial reconciliation.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Revenue
              </CardTitle>
              {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}₹
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹ {totalCombinedContribution}
              </div>
              <p className="text-xs text-muted-foreground">
                {`${monthName} ${year}`} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Employee Share
              </CardTitle>
              {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}₹
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹ {totalEmployeeContribution}
              </div>
              <p className="text-xs text-muted-foreground">35% of total cost</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Company Share
              </CardTitle>
              {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}₹
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹ {totalManagementContribution}
              </div>
              <p className="text-xs text-muted-foreground">
                65% subsidy amount
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reconciliation
              </CardTitle>
              {true ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-orange-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Complete</div>
              <p className="text-xs text-muted-foreground">{`${monthName} ${year}`}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Payroll Export</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">
                    Ready for Export - {`${monthName} ${year}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {subscribersStrength} employee subscriptions
                  </p>
                  <p className="text-sm text-gray-600">
                    Total deductions: ₹1,40,400
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm">Export CSV</Button>
                  <Button size="sm" variant="outline">
                    Export Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reconciliation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">November 2024</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Complete
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">December 2024</span>
                  <Badge variant="secondary">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                </div>
                <Button size="sm" className="w-full">
                  Mark December Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Monthly Financial Summary - December 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Working Days</h4>
                <p className="text-2xl font-bold">{workingDays}</p>
                <p className="text-sm text-gray-500">Total this month</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Average Daily Cost
                </h4>
                <p className="text-2xl font-bold">₹ {averageDailyTotalCost}</p>
                <p className="text-sm text-gray-500">Per working day</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Subscriber Rate
                </h4>
                <p className="text-2xl font-bold">
                  {percentOfsubscribedEmployeesFromTotal}%
                </p>
                <p className="text-sm text-gray-500">Of total employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
