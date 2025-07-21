import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Calendar = ({
  onDateSelect,
  selectedDate,
  highlightDates = [],
  className = "",
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const formatDate = (day) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const isSelected = (day) => {
    return selectedDate === formatDate(day);
  };

  const isHighlighted = (day) => {
    return highlightDates.includes(formatDate(day));
  };

  const isWeekend = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const handleDateClick = (day) => {
    if (onDateSelect) {
      onDateSelect(formatDate(day));
    }
  };

  const renderCalendarDays = () => {
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayClasses = [
        "h-10 w-10 flex items-center justify-center text-sm rounded-lg cursor-pointer transition-all duration-200",
        isToday(day) ? "bg-primary text-primary-foreground font-semibold" : "",
        isSelected(day) ? "bg-blue-100 text-blue-900 ring-2 ring-blue-500" : "",
        isHighlighted(day) && !isToday(day) && !isSelected(day)
          ? "bg-green-100 text-green-800"
          : "",
        isWeekend(day) ? "text-gray-400" : "text-gray-700",
        !isToday(day) &&
        !isSelected(day) &&
        !isHighlighted(day) &&
        !isWeekend(day)
          ? "hover:bg-gray-100"
          : "",
      ]
        .filter(Boolean)
        .join(" ");

      days.push(
        <div
          key={day}
          className={dayClasses}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>,
      );
    }

    return days;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h2 className="text-lg font-semibold text-gray-900">
          {monthNames[currentMonth]} {currentYear}
        </h2>

        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
    </div>
  );
};
