import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Eye,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";

export default function PayrollCalendar() {
  // const [currentDate, setCurrentDate] = useState(new Date());
  const location = useLocation();

  // Initialize currentDate from location.state or fallback to today
  const [currentDate, setCurrentDate] = useState(() => {
    const saved = sessionStorage.getItem("selectedCalendarDate");
    return saved ? new Date(saved) : new Date();
  });

  // 👇 Clears the state after using it once
  // useEffect(() => {
  //   if (location.state?.selectedDate) {
  //     window.history.replaceState({}, document.title);
  //   }
  // }, []);
  // useEffect(() => {
  //   const saved = sessionStorage.getItem("selectedCalendarDate");
  //   if (saved) {
  //     sessionStorage.removeItem("selectedCalendarDate");
  //   }
  // }, []);

  const navigate = useNavigate();
  const { role } = useAuth();

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1));
  };

  const formatDateForRoute = (day) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const isPastDate = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return date < today.setHours(0, 0, 0, 0);
  };

  const isWeekend = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.getDay() === 0 || date.getDay() === 6;
  };

  // const handleDateClick = (day) => {
  //   const selectedDate = formatDateForRoute(day);
  //   navigate(`/menu/${role}/${selectedDate}`);
  // };

  // const handleDateClick = (day) => {
  //   const selectedDate = new Date(currentYear, currentMonth, day);
  //   const formattedDate = formatDateForRoute(day);

  //   navigate(`/menu/${role}/${formattedDate}`, {
  //     state: { selectedDate: selectedDate.toISOString() },
  //   });
  // };

  const handleDateClick = (day) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    const formattedDate = formatDateForRoute(day);

    // ✅ Save to sessionStorage
    sessionStorage.setItem("selectedCalendarDate", selectedDate.toISOString());

    navigate(`/menu/${role}/${formattedDate}`);
  };

  const renderCalendarDays = () => {
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      // days.push(<div key={`empty-${i}`} className="h-12 w-12"></div>);
      days.push(
        <div
          key={`empty-${i}`}
          className="w-12 aspect-square flex items-center justify-center"
        ></div>,
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isPast = isPastDate(day);
      const isTodayDate = isToday(day);
      const isWeekendDate = isWeekend(day);

      // let dayClasses = [
      //   "h-12 w-12 flex items-center justify-center text-sm rounded-lg transition-all duration-200",
      //   "border border-transparent cursor-pointer",
      // ];
      let dayClasses = [
        "w-12 h-12 flex items-center justify-center aspect-square text-sm text-center leading-none rounded-lg transition-all duration-200",
        "border border-transparent font-normal",
      ];

      if (isPast) {
        dayClasses.push("bg-gray-200 text-gray-400 cursor-pointer");
      } else if (isTodayDate) {
        dayClasses.push(
          "border-blue-500 bg-blue-50 text-blue-700 font-semibold cursor-pointer",
        );
      } else if (isWeekendDate) {
        dayClasses.push("text-gray-400 bg-gray-50 cursor-pointer");
      } else {
        dayClasses.push(
          "hover:bg-blue-100 text-gray-700 shadow-sm cursor-pointer",
        );
      }

      days.push(
        <div
          key={day}
          className={dayClasses.join(" ")}
          onClick={() => handleDateClick(day)}
          title="Click to view menu and financial data"
        >
          {day}
        </div>,
      );
    }

    return days;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Financial Calendar
          </h1>
          <p className="text-lg text-gray-600">
            View lunch menus and financial data for any date.
          </p>
        </div>

        {/* Calendar Card */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <CalendarIcon className="h-6 w-6" />
                <span>
                  {monthNames[currentMonth]} {currentYear}
                </span>
              </CardTitle>

              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="h-12 flex items-center justify-center text-sm font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            {/* <div className="grid grid-cols-7 gap-2 mb-6">
              {renderCalendarDays()}
            </div> */}
            <div className="grid grid-cols-7 gap-1 justify-items-center">
              {renderCalendarDays()}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border border-blue-500 bg-blue-50 rounded"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <span>Past dates</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-white border border-gray-300 rounded shadow-sm"></div>
                <span>Viewable dates</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-50 rounded"></div>
                <span>Weekends</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Instructions */}
        <Card className="mt-6 bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Eye className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-2">
                  Payroll View Features:
                </h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• View lunch menus for any date</li>
                  <li>• See employee attendance counts</li>
                  <li>• Review daily financial impact</li>
                  <li>• Delete menus if needed (view-only for menu content)</li>
                  <li>• Generate cost reports per date</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
