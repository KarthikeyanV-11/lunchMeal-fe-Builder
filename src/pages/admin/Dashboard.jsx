import { Layout } from "../../components/shared/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
// import { Switch } from "@/c";
import {
  Users,
  Calendar,
  TrendingUp,
  Star,
  StarHalf,
  StarOff,
  CreditCard,
  Hourglass,
  ClockFading,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setEmployees,
  setMoneyContributions,
  setSubscribedEmployees,
  setTotalMonthlyContributions,
} from "../../slice/employeeSlice";
import axios from "axios";
import toast from "react-hot-toast";
import {
  setAllRatings,
  setLastThreeRatings,
  setMonthlyAvgRating,
} from "../../slice/menuFeedback";

//uses employeeSlice redux.
//backend api format: [{},{}...{}]

export default function AdminDashboard() {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  console.log(month);

  //LOCAL STATES
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSubscription, setShowSubscription] = useState(0);

  //REDUX RELATED
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  //READING THE FEEDBACKS SENT BY THE EMPLOYEE(USER)
  const fb = useSelector((state) => state.feedback.allFeedbacks);
  console.log(fb);

  const lastThree = useSelector((state) => state.feedback.lastThreeRatings);

  // FINDING OUT THE TOTAL STRENGTH
  // const employeeStrength = useSelector(
  //   (state) => state.employee.allEmployees.length,
  // );

  //FINDING OUT THE TOTAL SUBSCRIBED EMPLOYEES
  const subscribedEmployees = useSelector(
    (state) => state.employee.subscribedEmployees.length,
  );
  // console.log(employeeStrength[0]);

  const monthlyContribution = useSelector(
    (state) => state.employee.monthlyContributions,
  );
  console.log(monthlyContribution);

  const monthlyAvgRating = useSelector(
    (state) => state.feedback.monthlyAvgRating,
  );
  console.log(monthlyAvgRating);

  //USE EFFECTS
  // useEffect(() => {
  //   const fetchEmployees = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${BASE_URL}/employee/getAllEmployees`, // url for fetching all the employee details
  //       );

  //       const employeesArray = response.data;
  //       // console.log(employeesArray[0]); getting the first user

  //       dispatch(setEmployees(employeesArray));
  //     } catch (error) {
  //       console.error("Error fetching employees:", error.message);
  //     }
  //   };

  //   fetchEmployees();
  // }, [dispatch]);

  useEffect(() => {
    async function fetchRatings() {
      try {
        const res = await axios.get(`${BASE_URL}/rating/all`);
        const allRatingsCumFeedback = res.data;
        const lastThree = allRatingsCumFeedback.slice(0, 3);
        dispatch(setAllRatings(allRatingsCumFeedback));
        dispatch(setLastThreeRatings(lastThree));
      } catch (error) {
        console.error(error);
      }
    }
    fetchRatings();
  }, [dispatch]);

  useEffect(() => {
    async function fetchTotalSubscribers() {
      try {
        const res = await axios.get(
          `${BASE_URL}/subscription/active?month=${month + 1}&year=${year}`,
        );
        console.log(res);
        dispatch(setSubscribedEmployees(res.data));
        console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTotalSubscribers();
  }, [dispatch]);

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

  //monthly expense
  useEffect(() => {
    async function fetchTotalMonthlyExpense() {
      try {
        const res = await axios.get(
          `${BASE_URL}/payroll/totalMonthlyExpense?month=${month + 1}&year=${year}`,
        );
        console.log(res.data);
        dispatch(setTotalMonthlyContributions(res.data));
      } catch (error) {
        console.error(error);
      }
    }
    fetchTotalMonthlyExpense();
  }, []);

  useEffect(() => {
    async function fetchMonthyAvgRating() {
      try {
        const res = await axios.get(
          `${BASE_URL}/rating/avgMonthlyRating?month=${month}&year=${year}`,
        );
        console.log(res.data);
        dispatch(setMonthlyAvgRating(res.data));
      } catch (error) {
        console.error(error);
      }
    }
    fetchMonthyAvgRating();
  }, [dispatch]);

  useEffect(() => {
    async function fetchSubscriptionWindowOpen() {
      try {
        const res = await axios.get(
          `${BASE_URL}/subscription/subscriptionWindow`,
        );

        const remainingDays = res.data.status;
        setShowSubscription(remainingDays);

        console.log(showSubscription);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSubscriptionWindowOpen();
  }, []);

  //UTILITY FUNCTIONS
  function renderStars(rating) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const totalStars = hasHalfStar ? fullStars + 1 : Math.round(rating);

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={16} fill="orange" stroke="orange" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarHalf key={i} size={16} fill="orange" stroke="orange" />,
        );
      } else {
        stars.push(<StarOff key={i} size={16} stroke="orange" />);
      }
    }
    return stars;
  }

  function formatToINR(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  }

  //SUBMITTING EVENTS
  const handleSendNotification = async () => {
    if (!title || !message) {
      toast.error("Both title and message are required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/notifications`, {
        title,
        message,
        createdBy: user?.id,
        // date: new Date().toISOString(),
      });

      console.log(res);
      toast.success("Notification sent successfully");

      //updating the redux state

      //resetting
      setTitle("");
      setMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage lunch subscriptions and employee preferences.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Subscribers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscribedEmployees}</div>
              <p className="text-xs text-muted-foreground">
                +12 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Cost
              </CardTitle>
              {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
              <CreditCard className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatToINR(monthlyContribution.totalExpense)}
              </div>{" "}
              {/* subscribedEmployees * 100*/}
              <p className="text-xs text-muted-foreground">
                company share:{" "}
                {formatToINR(monthlyContribution.totalManagementContribution)}
              </p>
              <p className="text-xs text-muted-foreground">
                Employee share:{" "}
                {formatToINR(monthlyContribution.totalEmployeeContribution)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subscription Window
              </CardTitle>
              <ClockFading className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{showSubscription} days</div>
              <p className="text-xs text-muted-foreground">
                {showSubscription > 0
                  ? "Remaining"
                  : showSubscription === 0
                    ? "Closes today"
                    : "Closed"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Previous Month Avg Rating
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {monthlyAvgRating.avgRating?.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on {monthlyAvgRating.count} feedback
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Controls and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Send a notification</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notification Title"
                  className="w-full p-2 border rounded"
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Notification Message"
                  rows={4}
                  className="w-full p-2 border rounded"
                />

                <Button onClick={handleSendNotification} disabled={loading}>
                  {loading ? "Sending..." : "Send Notification"}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Subscription Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Subscription Window</p>
                  <p className="text-sm text-gray-500">
                    Allow new subscriptions
                  </p>
                </div>
                {/* <Switch defaultChecked /> */}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-renewal</p>
                  <p className="text-sm text-gray-500">
                    Automatically renew subscriptions
                  </p>
                </div>
                {/* <Switch defaultChecked /> */}
              </div>
              <Button className="w-full mt-4">Send Monthly Reminder</Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Feedback */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lastThree && lastThree.length > 0 ? (
                lastThree.map((feedback, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start border-b py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {feedback.remarks}
                      </p>
                      <p className="text-xs text-gray-500">
                        {feedback.employee?.firstName}{" "}
                        {feedback.employee?.lastName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(feedback.rating)}
                      <span className="ml-1 text-sm text-orange-600 font-semibold">
                        {feedback.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No feedback available.</p>
              )}

              {/* See All Ratings Button */}
              {fb && fb.length > 3 && (
                <Button onClick={() => setShowModal(true)}>
                  See All Ratings
                </Button>
              )}
            </div>

            {/* Modal */}
            {showModal && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={() => setShowModal(false)}
              >
                <div
                  className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg"
                  onClick={(e) => e.stopPropagation()} // prevent modal close when clicking inside
                >
                  <h2 className="text-lg font-bold mb-4">All Ratings</h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {fb.map((feedback, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-start border-b py-2"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {feedback.remarks}
                          </p>
                          <p className="text-xs text-gray-500">
                            {feedback.employee?.firstName}{" "}
                            {feedback.employee?.lastName}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(feedback.rating)}
                          <span className="ml-1 text-sm text-orange-600 font-semibold">
                            {feedback.rating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-right">
                    <Button onClick={() => setShowModal(false)}>Close</Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
