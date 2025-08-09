import { Layout } from "../../components/shared/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Calendar, MapPin, CreditCard, Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { setSubscriptionState } from "../../slice/authSlice";
// import { setSubscriptions } from "../../slice/subscriptionSlice";
import { toast } from "react-hot-toast";
// import { addFeedback } from "../../slice/menuFeedback";
import {
  setAllNotifications,
  setLastThreeNotifications,
} from "../../slice/adminNotification";
import {
  setMoneyContributions,
  setWorkingDaysStats,
} from "../../slice/employeeSlice";

export default function EmployeeDashboard() {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  //LOCAL STATES
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleString("default", { month: "long" });

  const [submittedRating, setSubmittedRating] = useState("");
  const [submittedDescription, setSubmittedDescription] = useState("");

  const [showModal, setShowModal] = useState(false);

  // Get last 3 notifications

  //REDUX RELATED
  // READING THE REDUX
  const user = useSelector((state) => state.auth.user);

  const [prevMonthSub, currenMonthSub] = useSelector(
    (state) => state.auth.subscriptions,
  );
  // console.log(subscriptionDetails);
  console.log(currenMonthSub?.status);

  const location = user?.location;
  const allNotifications = useSelector(
    (state) => state.notification.allNotifications, //the name as in the store
  );
  const lastThree = useSelector((state) => state.notification.lastThree);

  const dispatch = useDispatch();
  const storedSub = useSelector((state) => state.auth.subscriptions);

  const DaysRelated = useSelector((state) => state.employee.workingDaysStats);
  const workingDays = DaysRelated.workingDays;
  const remainingDays = DaysRelated.remainingWorkingDays;

  const moneyContributions = useSelector(
    (state) => state.employee.moneyContributions,
  );

  const employeeContribution = moneyContributions.employeeContribution;
  const managementContribution = moneyContributions.managementContribution;
  const totalContribution = moneyContributions.totalContribution;

  //USE EFFECTS
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/subscription/employee/${user?.id}`,
        );
        const allSubs = res.data;
        console.log(allSubs);
        // Dispatch to Redux store
        dispatch(setSubscriptionState(allSubs));

        const today = new Date();
        const year = today.getFullYear();

        const currentMonthKey = `${today
          .toLocaleString("default", { month: "long" })
          .toUpperCase()}_${year}`;

        const found = allSubs.find(
          (sub) => sub.duration === currentMonthKey && sub.status === "ACTIVE",
        );

        console.log(found);

        setIsActive(!!found);
      } catch (error) {
        console.error("Error fetching subscription:", error);
        setIsActive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  useEffect(() => {
    async function handleFetchingNotifications() {
      try {
        const res = await axios.get(`${BASE_URL}/notifications/all`);
        console.log(res.data);
        const allNotifications = res.data;
        // dispatching to the redux
        dispatch(setAllNotifications(allNotifications));
      } catch (error) {
        console.error(error);
      }
    }
    handleFetchingNotifications();
  }, []); // on mount

  useEffect(() => {
    async function handleFetchingRecentNotifications() {
      try {
        const res = await axios.get(`${BASE_URL}/notifications/lastThree`);
        console.log("LAST THREE", res.data);
        const lastThree = res.data;
        // dispatching to the redux
        dispatch(setLastThreeNotifications(lastThree));
      } catch (error) {
        console.error(error);
      }
    }
    handleFetchingRecentNotifications();
  }, []); // on mount

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

  //HANDLING SUBMITTING EVENTS
  // const handleSubmit = async () => {
  //   try {
  //     setFeedbackLoading(true);

  //     const token = localStorage.getItem("authToken"); // make sure it's correct key

  //     const payload = {
  //       attendance: true,
  //       hadLunch: true,
  //     };

  //     const dateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  //     const res = await axios.post(
  //       `${BASE_URL}/userSubscriptionDetails/hadLunch/date/${dateStr}?employeeId=${user?.id}&acknowledgedById=${user?.id}`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     toast.success("Lunch marked successfully!");
  //     setRating("");
  //     setDescription("");
  //     console.log(res.data);
  //   } catch (error) {
  //     console.error("Marking lunch failed:", error);
  //     const message = error.response?.data?.message || "Something went wrong!";
  //     toast.error(message);
  //   } finally {
  //     setFeedbackLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    try {
      setFeedbackLoading(true);

      const payload = {
        attendance: true,
        hadLunch: true,
      };

      const dateStr = new Date().toISOString().split("T")[0]; // e.g., 2025-07-31

      const res = await axios.put(
        `${BASE_URL}/userSubscriptionDetails/hadLunch/date/${dateStr}?employeeId=${user?.id}&acknowledgedById=${user?.id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json", // ✅ optional in Axios but fine to include
          },
        },
      );

      toast.success("Lunch marked successfully!");
      setRating("");
      setDescription("");
    } catch (error) {
      console.error("Marking lunch failed:", error);
      const message = error.response?.data?.message || "Something went wrong!";
      toast.error(message);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      setFeedbackLoading(true);

      const payload = {
        employee: user?.id,
        rating: rating || null, // if empty, send null
        remarks: description || "", // if empty, send empty string
      };

      console.log("Payload being sent:", payload);

      const res = await axios.post(`${BASE_URL}/rating`, payload);

      //set the state
      setSubmittedRating(res.data.rating);
      setSubmittedDescription(res.data.remarks);

      //updating the feedback in the redux
      // dispatch(addFeedback({ name: user?.firstName, rating, remarks }));

      // Optional: Show toast or alert
      toast.success("Feedback submitted!");
      setRating("");
      setDescription("");
      console.log(res);
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      setFeedbackLoading(false);
    }
  };

  //UTILITY FUNCTIONS
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  }

  function formatToINR(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Top Section: Welcome + Attendance Button */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
              Welcome back,{" "}
              {user?.firstName || user?.lastName
                ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
                : "John Doe"}
              !
            </h1>
            <p className="text-lg text-gray-600">
              Here's your lunch subscription overview for this month.
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={feedbackLoading}
            className="w-full sm:w-auto"
          >
            {feedbackLoading ? "Submitting..." : "Mark Had Lunch"}
          </Button>
        </div>

        {/* Subscription Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            {/* <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
            </CardHeader> */}
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
                    currenMonthSub?.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {currenMonthSub?.status === "ACTIVE"
                    ? "Active"
                    : "Not Active"}
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
              <div className="text-2xl font-bold">
                {formatToINR(totalContribution)}
              </div>
              <p className="text-xs text-muted-foreground">
                Company share: {formatToINR(managementContribution)}
              </p>
              <p className="text-xs text-muted-foreground font-bold">
                Employee share: {formatToINR(employeeContribution)}
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
              <p className="text-xs text-muted-foreground">
                {location?.charAt(0).toUpperCase() +
                  location?.slice(1).toLowerCase()}{" "}
                Location
              </p>
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
              <div className="text-2xl font-bold">{remainingDays}</div>
              <p className="text-xs text-muted-foreground">Working days left</p>
            </CardContent>
          </Card>
        </div>

        {/* Feedback + Notifications Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feedback Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Today's Lunch Feedback</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submittedRating || submittedDescription ? (
                // ✅ If feedback is submitted, show only the summary
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-gray-800 space-y-2 text-center mt-20">
                  <h3 className="text-lg font-bold text-green-700">
                    Thanks for your feedback!
                  </h3>

                  <div className="flex flex-col items-center space-y-1">
                    <p className="text-base">
                      <span className="font-medium">Rating:</span>{" "}
                      <span className="text-yellow-600">
                        {submittedRating} / 5
                      </span>
                    </p>

                    <p className="text-base">
                      <span className="font-medium">Comments:</span>{" "}
                      {submittedDescription ? (
                        <span className="text-gray-700">
                          {submittedDescription}
                        </span>
                      ) : (
                        <span className="italic text-gray-400">
                          No description given.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                // ❌ If not submitted, show form
                <div className="space-y-4 mt-4">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rate the food (1 to 5){" "}
                      <span className="text-gray-400">(Optional)</span>
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select rating</option>
                      <option value="1">1 - Very Bad</option>
                      <option value="2">2 - Bad</option>
                      <option value="3">3 - Okay</option>
                      <option value="4">4 - Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description / Comments{" "}
                      <span className="text-gray-400">(Optional)</span>
                    </label>
                    <textarea
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Share your feedback on the food"
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex justify-center pt-2">
                    <Button
                      onClick={handleRatingSubmit}
                      disabled={feedbackLoading}
                    >
                      {feedbackLoading ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-orange-500" />
                <span>Recent Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lastThree.map((notification) => (
                  <div
                    key={notification.id}
                    className="relative p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <p className="absolute top-3 right-4 text-xs text-gray-400">
                      {new Date(notification.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                  </div>
                ))}

                {/* SEE ALL BUTTON */}
                <Button onClick={() => setShowModal(true)}>
                  See all notifications
                </Button>
              </div>
            </CardContent>

            {/* MODAL */}
            {showModal && (
              <div
                className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center"
                onClick={() => setShowModal(false)} // 🔹 Clicking backdrop closes modal
              >
                <div
                  className="bg-white w-full max-w-xl rounded-xl p-6 relative shadow-lg"
                  onClick={(e) => e.stopPropagation()} // 🔹 Prevent closing when clicking inside
                >
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-lg"
                  >
                    &times;
                  </button>

                  <h2 className="text-xl font-bold mb-4 text-gray-800">
                    All Notifications
                  </h2>

                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {allNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="relative p-4 rounded-xl border border-gray-200 shadow-sm"
                      >
                        <p className="absolute top-3 right-4 text-xs text-gray-400">
                          {new Date(notification.date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}
