// import { Layout } from "@/components/shared/Layout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Calendar, MapPin, CreditCard, Bell } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function EmployeeDashboard() {
//   //reading the redux state values
//   const user = useSelector((state) => state.auth.user);
//   const subscribedEmployees = useSelector(
//     (state) => state.employee.subscribedEmployees,
//   );

//   const dispatch = useDispatch();

//   //for getting the subscription status from the backend
//   const [isActive, setIsActive] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSubscriptions = async () => {
//       try {
//         const token = localStorage.getItem("authToken");

//         const res = await axios.get("/api/subscription", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const allSubs = res.data; // assuming it's the array you showed earlier
//         dispatch(setSubscriptions(allSubs));

//         // Check if current month is active
//         const currentMonthKey = `${today
//           .toLocaleString("default", {
//             month: "short",
//           })
//           .toUpperCase()}_${year}`;

//         const found = allSubs.find(
//           (sub) => sub.duration === currentMonthKey && sub.status === "ACTIVE",
//         );

//         setIsActive(!!found);
//       } catch (err) {
//         console.error("Error fetching subscriptions:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubscriptions();
//   }, []);

//   // Shared date values for days part
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = today.getMonth();
//   const day = today.getDate();
//   const monthName = today.toLocaleString("default", { month: "long" });

//   // 1. Get total working days in a month
//   function getWorkingDaysInMonth(year, month) {
//     let workingDays = 0;
//     const date = new Date(year, month, 1); // month is 0-indexed

//     while (date.getMonth() === month) {
//       const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
//       if (day >= 1 && day <= 5) {
//         workingDays++;
//       }
//       date.setDate(date.getDate() + 1);
//     }

//     return workingDays;
//   }

//   // 2. Calculate total cost
//   function calculateMonthlyCost(year, month) {
//     const workingDays = getWorkingDaysInMonth(year, month);

//     const companyContribution = workingDays * 65;
//     const employeeContribution = workingDays * 35;
//     const total = workingDays * 100;

//     return {
//       workingDays,
//       companyContribution,
//       employeeContribution,
//       total,
//     };
//   }

//   const costDetails = calculateMonthlyCost(year, month);

//   // 3. Calculate remaining working days from today
//   function getRemainingWorkingDays(year, month, startDay) {
//     let remainingWorkingDays = 0;
//     const date = new Date(year, month, startDay);

//     while (date.getMonth() === month) {
//       const day = date.getDay();
//       if (day >= 1 && day <= 5) {
//         remainingWorkingDays++;
//       }
//       date.setDate(date.getDate() + 1);
//     }

//     return remainingWorkingDays;
//   }

//   const remainingWorkingDays = getRemainingWorkingDays(year, month, day);

//   return (
//     <Layout>
//       <div className="max-w-7xl mx-auto p-6">
//         {/* Welcome Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
//             Welcome back, {user?.name || "John"}!
//           </h1>
//           <p className="text-lg text-gray-600">
//             Here's your lunch subscription overview for this month.
//           </p>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Subscription Status
//               </CardTitle>

//               {loading ? (
//                 <Badge variant="outline" className="text-gray-600">
//                   Loading...
//                 </Badge>
//               ) : (
//                 <Badge
//                   variant="default"
//                   className={
//                     isActive
//                       ? "bg-green-100 text-green-800"
//                       : "bg-red-100 text-red-800"
//                   }
//                 >
//                   {isActive ? "Active" : "Not Active"}
//                 </Badge>
//               )}
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {monthName} {year}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 Valid till month end
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Monthly Cost
//               </CardTitle>
//               <CreditCard className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {/* ₹ {costDetails.total} */}₹ {subscribedEmployees * 100}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 {/* Company share: ₹ {costDetails.companyContribution} */}
//                 Company share: ₹ {subscribedEmployees * 65}
//               </p>
//               <p className="text-xs text-muted-foreground font-bold">
//                 {/* Employee share: ₹ {costDetails.employeeContribution} */}
//                 Employee share: ₹ {subscribedEmployees * 35}
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Location</CardTitle>
//               <MapPin className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">Chennai</div>
//               <p className="text-xs text-muted-foreground">Primary Location</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Days Remaining
//               </CardTitle>
//               <Calendar className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{remainingWorkingDays}</div>
//               <p className="text-xs text-muted-foreground">Working days left</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Quick Actions */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <Calendar className="h-5 w-5" />
//                 <span>Today's Menu</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4 mb-4">
//                 {/* Rating */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Rate the food (1 to 5)
//                   </label>
//                   <select
//                     value={rating}
//                     onChange={(e) => setRating(e.target.value)}
//                     className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select rating</option>
//                     <option value="1">1 - Very Bad</option>
//                     <option value="2">2 - Bad</option>
//                     <option value="3">3 - Okay</option>
//                     <option value="4">4 - Good</option>
//                     <option value="5">5 - Excellent</option>
//                   </select>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Description / Comments
//                   </label>
//                   <textarea
//                     rows="3"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Share your feedback on the food"
//                   />
//                 </div>
//               </div>

//               {/* Submit */}
//               <div className="flex space-x-2">
//                 <Button size="sm" onClick={handleSubmit} disabled={loading}>
//                   {loading ? "Submitting..." : "Mark Had Lunch"}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <Bell className="h-5 w-5" />
//                 <span>Recent Notifications</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 <div className="text-sm">
//                   <p className="font-medium">Menu updated for next week</p>
//                   <p className="text-gray-500">2 hours ago</p>
//                 </div>
//                 <div className="text-sm">
//                   <p className="font-medium">Subscription renewal reminder</p>
//                   <p className="text-gray-500">1 day ago</p>
//                 </div>
//                 <div className="text-sm">
//                   <p className="font-medium">New lunch vendor onboarded</p>
//                   <p className="text-gray-500">3 days ago</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </Layout>
//   );
// }

import { Layout } from "@/components/shared/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, CreditCard, Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { setSubscriptions } from "../../slice/subscriptionSlice";
import { addFeedback } from "../../slice/menuFeedback";
import { toast } from "react-hot-toast";

export default function EmployeeDashboard() {
  const user = useSelector((state) => state.auth.user);
  const subscribedEmployees = useSelector(
    (state) => state.employee.subscribedEmployees,
  );

  const dispatch = useDispatch();

  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  const monthName = today.toLocaleString("default", { month: "long" });

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const res = await axios.get("/api/subscription", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allSubs = res.data;
        dispatch(setSubscriptions(allSubs));

        const currentMonthKey = `${today
          .toLocaleString("default", {
            month: "short",
          })
          .toUpperCase()}_${year}`;

        const found = allSubs.find(
          (sub) => sub.duration === currentMonthKey && sub.status === "ACTIVE",
        );

        setIsActive(!!found);
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  function getWorkingDaysInMonth(year, month) {
    let workingDays = 0;
    const date = new Date(year, month, 1);

    while (date.getMonth() === month) {
      const day = date.getDay();
      if (day >= 1 && day <= 5) {
        workingDays++;
      }
      date.setDate(date.getDate() + 1);
    }

    return workingDays;
  }

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

  const handleSubmit = async () => {
    try {
      setFeedbackLoading(true);

      const payload = {
        employee: 33,
        rating: rating || null, // if empty, send null
        remarks: description || "", // if empty, send empty string
      };

      const res = await axios.post(
        "http://192.168.3.121:8080/api/v1/rating",
        payload,
      );

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

  // const feedbacks = useSelector((state) => state.feedback.items);
  // const todayDate = new Date().toISOString().split("T")[0];
  // const hasSubmittedToday = feedbacks.some(
  //   (f) => f.date === todayDate && f.employeeId === user?.id,
  // );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome back, {user?.name || "John"}!
          </h1>
          <p className="text-lg text-gray-600">
            Here's your lunch subscription overview for this month.
          </p>
        </div>

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
              <div className="text-2xl font-bold">
                ₹ {subscribedEmployees * 100}
              </div>
              <p className="text-xs text-muted-foreground">
                Company share: ₹ {subscribedEmployees * 65}
              </p>
              <p className="text-xs text-muted-foreground font-bold">
                Employee share: ₹ {subscribedEmployees * 35}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Today's Menu</span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4 mb-4">
                {/* Optional Rating */}
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

                {/* Optional Description */}
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
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={feedbackLoading}
                >
                  {feedbackLoading ? "Submitting..." : "Mark Had Lunch"}
                </Button>
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
