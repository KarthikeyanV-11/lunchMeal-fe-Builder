import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../../components/shared/Layout";
import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Users,
  DollarSign,
  Calendar,
  Clock,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useMenu } from "../../contexts/MenuContext";
// import { toast } from "@/hooks/use-toast";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setDailyAttendeesCountStats } from "../../slice/employeeSlice";

export default function MenuDisplay() {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const dispatch = useDispatch();
  const { role, selectedDate } = useParams();
  const navigate = useNavigate();
  const { role: userRole } = useAuth();
  const { fetchMenuForDate, loading } = useMenu();

  console.log(selectedDate);

  const employeeId = useSelector((state) => state.auth.user?.id);

  const [attendanceStatus, setAttendanceStatus] = useState(null);

  const [dayMenu, setDayMenu] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  const date = new Date(selectedDate);

  const formattedDate = date.toLocaleDateString("en-GB");
  const today = new Date();
  // Normalize today's date for comparisons (strip time)
  const todayMidnight = new Date(today.setHours(0, 0, 0, 0));

  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isPastDate = date < todayMidnight;
  const isToday = date.toDateString() === today.toDateString();

  // Attendance deadline: attendance must be marked at least 1 day before date
  const attendanceDeadline = new Date(date);
  attendanceDeadline.setDate(attendanceDeadline.getDate() - 1);
  const canMarkAttendance = todayMidnight <= attendanceDeadline && !isPastDate;

  const dailyAttendeesCount = useSelector(
    (state) => state.employee.attendeesStats,
  );
  console.log(dailyAttendeesCount);

  useEffect(() => {
    async function loadMenu() {
      // setLoading(true);
      const fetchedMenu = await fetchMenuForDate(selectedDate);
      console.log(fetchedMenu);
      if (fetchedMenu) {
        const items = fetchedMenu.menuItems
          ? fetchedMenu.menuItems.split(",").map((item) => item.trim())
          : [];
        setMenuItems(items);
        setDayMenu(fetchedMenu);
      } else {
        setMenuItems([]);
        setDayMenu(null);
      }
      // setLoading(false);
    }

    loadMenu();
  }, [selectedDate, fetchMenuForDate]);

  console.log(selectedDate);

  useEffect(() => {
    async function fetchDailyAttendeesStats() {
      try {
        const res = await axios.get(
          `${BASE_URL}/userSubscriptionDetails/attendanceDetails/${selectedDate}`,
        );
        console.log(res.data);
        dispatch(setDailyAttendeesCountStats(res.data));
      } catch (error) {
        console.error("Error fetching attendance stats:", error);
      }
    }
    fetchDailyAttendeesStats();
  }, [selectedDate]);

  const handleAttendanceChange = async () => {
    if (!canMarkAttendance) {
      toast.error("🚫 Lunch attendance closed for this date");
      return;
    }

    try {
      console.log(employeeId);

      const response = await axios.post(
        `${BASE_URL}/userSubscriptionDetails/skipLunch/${employeeId}?date=${selectedDate}`,
        null,
      );

      console.log(response);

      // Optionally update state based on response
      setAttendanceStatus(false);
      toast.success("🍽️ You have successfully marked as skipping lunch!");
    } catch (error) {
      console.error("Error skipping lunch:", error);
      toast.error(error.response.data.message);
    }
  };

  console.log(menuItems);
  // const handleGoBack = () => {
  //   // navigate(`/${userRole}/calendar`);
  //   navigate(`/${userRole}/calendar`, {
  //     state: { selectedDate: selectedDate }, // Pass it back!
  //   });
  // };

  const handleGoBack = () => {
    const selectedDateObj = new Date(selectedDate); // convert to Date
    navigate(`/${userRole}/calendar`, {
      state: { selectedDate: selectedDateObj.toISOString() }, // pass ISO string
    });
  };

  if (isWeekend) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <Button variant="ghost" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Calendar
          </Button>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Lunch Service
              </h2>
              <p className="text-gray-600">
                {formattedDate} falls on a weekend. There is no lunch service on
                weekends.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Calendar</span>
          </Button>

          {/* <Badge variant="outline" className="text-lg px-3 py-1">
            {formattedDate}
          </Badge> */}
        </div>

        {/* Date Header */}
        {/* Date Header with "I will skip lunch" button */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 md:mb-0">
              Lunch Menu - {formattedDate}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {isToday && (
                <Badge className="bg-blue-100 text-blue-800">Today</Badge>
              )}
              {isPastDate && <Badge variant="secondary">Past Date</Badge>}
              <span className="capitalize">{userRole} View</span>
            </div>
          </div>

          {/* Show "Skip lunch" button only if conditions match */}
          {userRole === "employee" &&
            !isPastDate &&
            menuItems.length > 0 &&
            canMarkAttendance && (
              <Button
                onClick={handleAttendanceChange}
                className="flex items-center space-x-2 text-white transition-colors bg-red-400 hover:bg-red-500"
              >
                <XCircle className="h-4 w-4" />
                <span>I will skip lunch</span>
              </Button>
            )}
        </div>

        {/* Menu Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Menu for today</CardTitle>
          </CardHeader>

          {/* <CardContent> */}
          {loading ? (
            <p>Loading menu...</p>
          ) : !dayMenu ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                No menu available for this date.
              </p>
            </div>
          ) : (
            <div className="p-6 border rounded-md border-gray-200 space-y-4">
              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800">
                {dayMenu.menuName || "Lunch Menu"}
              </h2>

              {/* Description */}
              {dayMenu.description && (
                <p className="text-gray-600 text-sm">{dayMenu.description}</p>
              )}

              {/* Grid of Menu Items */}
              {menuItems.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    Items:
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {menuItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center text-center px-3 py-2 bg-amber-100 text-amber-800 font-medium text-sm rounded-md shadow-sm hover:bg-amber-200 transition min-h-[48px]"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* </CardContent> */}
        </Card>

        {/* Employee Attendance Section
        {userRole === "employee" && !isPastDate && menuItems.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Attendance</span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              {canMarkAttendance ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    Will you attend lunch on {formattedDate}?
                  </p>

                  <div className="flex">
                    <Button
                      onClick={handleAttendanceChange}
                      className={`flex items-center space-x-2 text-white transition-colors bg-red-400 hover:bg-red-500`}
                      variant="default"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>I will skip lunch</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-orange-700 font-medium">
                    Lunch attendance closed for this date
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Attendance must be marked at least 1 day in advance
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )} */}

        {/* Admin Attendance Overview */}
        {userRole === "admin" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Attendance Overview</span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              {/* <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {dailyAttendeesCount.totalPresent}
                  </div>
                  <div className="text-sm text-gray-600">Will Attend</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {dailyAttendeesCount.totalAbsents}
                  </div>
                  <div className="text-sm text-gray-600">Will Skip</div>
                </div>
                 <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">106</div>
                  <div className="text-sm text-gray-600">No Response</div>
                </div> 
              </div> */}
              <div className="flex justify-evenly gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {dailyAttendeesCount.totalPresent}
                  </div>
                  <div className="text-sm text-gray-600">Will Attend</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {dailyAttendeesCount.totalAbsents}
                  </div>
                  <div className="text-sm text-gray-600">Will Skip</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payroll Section */}
        {userRole === "payroll" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Financial Summary</span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Daily Cost</h4>
                  <p className="text-2xl font-bold text-gray-900">₹3,360</p>
                  <p className="text-sm text-gray-600">
                    {dailyAttendeesCount.totalPresent} attendees × ₹100 per meal
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Employee Share
                  </h4>
                  <p className="text-2xl font-bold text-green-600">₹1,680</p>
                  <p className="text-sm text-gray-600">35% of total cost</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
