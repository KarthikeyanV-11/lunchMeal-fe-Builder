import { Layout } from "@/components/shared/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, CreditCard, Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { setSubscriptionState } from "../../slice/authSlice";
// import { setSubscriptions } from "../../slice/subscriptionSlice";
import { toast } from "react-hot-toast";
import { addFeedback } from "../../slice/menuFeedback";

export default function EmployeeDashboard() {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const dispatch = useDispatch();
  const storedSub = useSelector((state) => state.auth.subscriptions);
  console.log(storedSub);

  // READING THE REDUX
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  const subscriptionDetails = useSelector((state) => state.auth.subscriptions);
  const location = user?.location;

  console.log(user?.id);
  console.log(subscriptionDetails);
  // console.log(subscriptionDetails[1].employee.id);

  //LOCAL STATES
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const today = new Date();
  const year = today.getFullYear();
  const monthName = today.toLocaleString("default", { month: "long" });

  const [submittedRating, setSubmittedRating] = useState("");
  const [submittedDescription, setSubmittedDescription] = useState("");

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
      console.log(res.data);
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
      dispatch(addFeedback({ name: user?.firstName, rating, remarks }));

      // Optional: Show toast or alert
      toast.success("Feedback submitted!");
      setRating("");
      setDescription("");
      console.log(res);
    } catch (error) {
      // toast.error(error.data.message);
      console.log(error);
      console.log(error.response.data);
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      setFeedbackLoading(false);
    }
  };

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
              <div className="text-2xl font-bold">₹ {0 * 100}</div>
              <p className="text-xs text-muted-foreground">
                Company share: ₹ {0 * 65}
              </p>
              <p className="text-xs text-muted-foreground font-bold">
                Employee share: ₹ {0 * 35}
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
              <div className="text-2xl font-bold">{0}</div>
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
              <div className="space-y-4">
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
                  <Button onClick={handleRatingSubmit}>Submit</Button>
                </div>
              </div>

              {/* Feedback Summary */}
              {(submittedRating || submittedDescription) && (
                <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm text-gray-700 mt-4 space-y-1">
                  <p className="font-semibold">Your feedback for today:</p>
                  {submittedRating ? (
                    <p>Rating: {submittedRating} / 5</p>
                  ) : (
                    <p className="text-gray-400 italic">
                      You haven’t rated the food yet.
                    </p>
                  )}
                  {submittedDescription ? (
                    <p>Feedback: {submittedDescription}</p>
                  ) : (
                    <p className="text-gray-400 italic">
                      No description given.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications Card */}
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
