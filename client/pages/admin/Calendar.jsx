// src/components/ui/AdminWeekViewCalendar.jsx
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Edit3,
  CalendarDays,
  Vegan,
  UtensilsCrossed,
  Salad,
  Ham,
} from "lucide-react";
import { Layout } from "@/components/shared/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import WeekMenuModal from "../../components/ui/WeekMenuModal";
import CreateTemplateModal from "../../components/ui/CreateTemplateModal";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RefreshCw } from "lucide-react";
import { useDispatch } from "react-redux";
import { setNewTemplate } from "../../slice/menuSlice";

export default function AdminWeekViewCalendar() {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [weeks, setWeeks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  // State for the Weekly Menu Assignment Modal
  const [isWeekMenuModalOpen, setIsWeekMenuModalOpen] = useState(false);
  // State for the Create New Template Modal
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] =
    useState(false);

  // New state to hold data for the selected week to be passed to the WeekMenuModal
  const [selectedWeekData, setSelectedWeekData] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { role } = useAuth();

  useEffect(() => {
    const generateWeeks = () => {
      const result = [];

      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const dayOfWeek = firstDayOfMonth.getDay(); // Sunday=0 ... Saturday=6

      // Calculate Monday on or before the first day of this month
      const currentMonday = new Date(firstDayOfMonth);
      currentMonday.setDate(
        firstDayOfMonth.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1),
      );

      for (let i = 0; i < 5; i++) {
        const weekStart = new Date(currentMonday);
        weekStart.setDate(currentMonday.getDate() + i * 7);

        const weekDates = [];
        for (let d = 0; d < 7; d++) {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + d);
          weekDates.push(date);
        }

        const monday = weekDates[0]; // Monday is index 0
        const friday = weekDates[4]; // Friday is index 4
        const rangeLabel = `${formatDisplayDate(monday)} - ${formatDisplayDate(friday)}`;

        // Calculate individual day editability for the modal
        const dayEditability = {
          monday: isDayEditable(weekDates[0]),
          tuesday: isDayEditable(weekDates[1]),
          wednesday: isDayEditable(weekDates[2]),
          thursday: isDayEditable(weekDates[3]),
          friday: isDayEditable(weekDates[4]),
        };

        result.push({
          range: rangeLabel,
          dates: weekDates,
          assignedMenus: {
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null,
          },
          // IMPORTANT: Add the isDayEditable map here
          isDayEditable: dayEditability,
        });
      }

      setWeeks(result);
    };

    const fetchMonthlyMenu = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/menuSchedule/byMonthAndYear?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`,
        );

        console.log("API Response:", res);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched Data:", data); // 👀 See the raw API data

        const allSchedules = data.flatMap((week) =>
          ["monday", "tuesday", "wednesday", "thursday", "friday"]
            .map((day) => week[day])
            .filter(Boolean),
        );

        console.log("Flattened Schedules (Mon–Fri):", allSchedules);

        setWeeks((prevWeeks) =>
          prevWeeks.map((week, index) => {
            const updatedAssignedMenus = { ...week.assignedMenus };

            console.log(`\n--- Week ${index + 1} ---`);
            week.dates.forEach((date) => {
              const formatted = date.toISOString().split("T")[0]; // UTC date string as before
              const schedule = allSchedules.find(
                (entry) => entry?.date === formatted,
              );

              console.log(`Checking date: ${formatted}`);
              if (schedule) {
                // Use UTC day index to get the day clearly without timezone issues
                // 0=Sunday, 1=Monday, ..., 6=Saturday
                const dayIndex = date.getUTCDay();
                const weekdays = [
                  "sunday",
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                ];
                const day = weekdays[dayIndex];

                console.log(`→ Found match on ${day}:`, schedule);

                // Only assign menus for Monday through Friday as before
                if (
                  [
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                  ].includes(day)
                ) {
                  updatedAssignedMenus[day] = {
                    menuName: schedule.menuName,
                    menuType: schedule.menuType,
                  };
                }
              } else {
                console.log(`→ No match found for ${formatted}`);
              }
            });

            return {
              ...week,
              assignedMenus: updatedAssignedMenus,
            };
          }),
        );
      } catch (error) {
        console.error("Failed to fetch monthly menu:", error);
      }
    };

    generateWeeks();
    fetchMonthlyMenu(); // 🆕 Add this
  }, [currentDate]);

  const formatDisplayDate = (date) => {
    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const formatRouteDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate(),
    ).padStart(2, "0")}`;
  };

  // --- NEW isDayEditable FUNCTION (from your provided code) ---
  const isDayEditable = (dateToCheck) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to start of day

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Normalize tomorrow's date

    const checkedDate = new Date(dateToCheck);
    checkedDate.setHours(0, 0, 0, 0); // Normalize the date being checked

    // Rule 1: Today and past days are not editable
    if (checkedDate <= today) {
      return false;
    }

    // Rule 2: Tomorrow is editable
    if (checkedDate.getTime() === tomorrow.getTime()) {
      return true;
    }

    // Rule 3: Next days or weeks are editable
    if (checkedDate > tomorrow) {
      return true;
    }

    return false;
  };

  // --- MODIFIED isWeekRangeEditable FUNCTION (for modal trigger) ---
  const isWeekRangeEditable = (weekDates) => {
    if (!Array.isArray(weekDates) || weekDates.length === 0) return false;

    // A week is editable if at least one day in it (Monday to Friday)
    // is editable according to the new `isDayEditable` logic.
    // We only care about Monday to Friday for menu assignments.
    return weekDates.slice(0, 5).some((date) => isDayEditable(date));
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const getCurrentMonthYear = () => {
    const options = { month: "long", year: "numeric" };
    return currentDate.toLocaleDateString("en-US", options);
  };

  const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // This list would ideally come from an API or a global state
  // const [menuTemplates] = useSelector((state) => state.menu.availableTemplates);
  const menuTemplates = useSelector((state) => state.menu.availableTemplates);

  console.log(menuTemplates);

  const handleWeekClick = (week) => {
    // We now check if the week has *any* editable days to open the modal
    const editable = isWeekRangeEditable(week.dates);

    if (editable) {
      setSelectedWeekData(week);
      setIsWeekMenuModalOpen(true);
    } else {
      // Replaced alert with a console.log, as per instructions to avoid alert()
      console.log("This week has no editable days for menu assignment.");
      // You might want to implement a custom message box here instead of console.log
      // For example: show a temporary notification or a custom modal.
    }
  };

  // Function to handle saving assignments from the WeekMenuModal (to be passed to modal)
  // Inside AdminWeekViewCalendar.jsx

  const handleSaveWeekAssignment = async (weekToUpdate, assignments) => {
    console.log(
      "Saving assignments for week:",
      weekToUpdate.range,
      assignments,
    );

    // OPTIONAL: Optimistic UI update (kept for immediate feedback)
    setWeeks((prevWeeks) =>
      prevWeeks.map((week) =>
        week.range === weekToUpdate.range
          ? { ...week, assignedMenus: assignments }
          : week,
      ),
    );

    // --- THIS IS THE CRITICAL PART YOU NEED TO ADD/MODIFY ---
    try {
      const response = await fetch(
        `${BASE_URL}/your-backend-api/save-menu-assignments`,
        {
          // <--- IMPORTANT: Adjust this endpoint to your actual backend API
          method: "POST", // Or 'PUT' depending on your backend's design
          headers: {
            "Content-Type": "application/json",
            // Add any authentication headers if your API requires them (e.g., 'Authorization': `Bearer ${yourAuthToken}`)
          },
          body: JSON.stringify({
            // You need to send data in a format your backend expects to identify the week and update assignments
            weekStartDate: weekToUpdate.dates[0].toISOString().split("T")[0], // Example: Send the Monday's date
            assignments: assignments, // The object containing monday, tuesday, etc. menu details
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json(); // Try to get error message from backend
        throw new Error(
          `Failed to save menu assignments: ${errorData.message || response.statusText}`,
        );
      }

      console.log("Menu assignments successfully saved to backend.");

      // After successful save to backend, re-fetch to ensure calendar is in sync
      await fetchMonthlyMenu();
    } catch (error) {
      console.error("Error saving menu assignments:", error);
      // TODO: Implement user-facing error feedback (e.g., a toast notification)
      // If you did an optimistic update, you might want to revert it here if the save failed.
    }

    // Close the modal and clear selected data regardless of save success/failure
    setIsWeekMenuModalOpen(false);
    setSelectedWeekData(null);
  };

  const handleCreateNewTemplate = (templateData) => {
    console.log("Creating new template:", templateData);

    dispatch(setNewTemplate(templateData)); // ✅ immediately update Redux state

    setIsCreateTemplateModalOpen(false);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        {/* Header with Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded flex items-center justify-center">
              <div>
                <CalendarDays />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Menu Assignment Calendar
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-gray-200 rounded"
              onClick={goToPreviousMonth}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-1 text-lg font-medium">
              {getCurrentMonthYear()}
            </span>
            <button
              className="p-2 hover:bg-gray-200 rounded"
              onClick={goToNextMonth}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-6 border-b border-gray-200">
            <div className="p-4 font-medium text-gray-700 border-r border-gray-200">
              Week
            </div>
            {dayLabels.map((day) => (
              <div
                key={day}
                className="p-4 font-medium text-gray-700 text-center border-r border-gray-200 last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>
          {weeks.map((week, index) => {
            const isAnyDayEditableInWeek = isWeekRangeEditable(week.dates); // Use this for overall week lock
            return (
              <div
                key={index}
                className={`grid grid-cols-6 border-b border-gray-200 last:border-b-0`}
              >
                {/* Week Label Column with onClick for WeekMenuModal */}
                <div
                  className={`p-4 border-r border-gray-200 flex flex-col cursor-pointer ${
                    isAnyDayEditableInWeek ? "hover:bg-gray-50" : "opacity-70"
                  }`}
                  onClick={() => {
                    if (isAnyDayEditableInWeek) {
                      setSelectedWeekData(week);
                      setIsWeekMenuModalOpen(true);
                    } else {
                      // Replaced alert with console.log
                      console.log(
                        "This week has no editable days for menu assignment.",
                      );
                    }
                  }}
                >
                  <div className="font-medium text-gray-800 mb-2">
                    {week.range}
                  </div>
                  <div className="flex items-center gap-2">
                    {isAnyDayEditableInWeek ? (
                      <>
                        <Edit3 className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">
                          Editable
                        </span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500 font-medium">
                          Locked
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Day Columns (Mon–Fri) */}
                {week.dates.slice(0, 5).map((date, idx) => {
                  const dayKey = dayLabels[idx]?.toLowerCase(); // e.g., 'monday'
                  const assignedMenu = week.assignedMenus[dayKey];
                  const formattedDate = formatRouteDate(date);
                  const editableDay = isDayEditable(date); // Check individual day's editability

                  return (
                    <div
                      key={idx}
                      className={`p-4 border-r border-gray-200 last:border-r-0 text-center hover:bg-gray-50 cursor-pointer ${
                        !editableDay ? "opacity-70" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/menu/${role}/${formattedDate}`);
                      }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <div className="text-gray-400 text-lg">
                            <UtensilsCrossed />
                          </div>
                        </div>

                        <span className="text-sm text-gray-500 mb-1 font-bold">
                          {assignedMenu
                            ? assignedMenu.menuName
                            : "Not assigned"}
                        </span>

                        <div className="flex items-center gap-1">
                          {editableDay ? (
                            <Edit3 className="w-3 h-3 text-green-500" />
                          ) : (
                            <Lock className="w-3 h-3 text-gray-400" />
                          )}
                          <span className="text-xs text-gray-500">
                            {editableDay ? "Editable" : "Locked"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center items-center">
          <Button className="mt-4 flex gap-2 justify-center items-center">
            <RefreshCw className="w-4" /> <span>Sync</span>
          </Button>
        </div>

        {/* Access Policy */}
        <div className="bg-orange-200 text-gray-900 p-4 rounded-md mt-6 text-sm">
          <h2 className="font-semibold mb-1">Access Control Policy</h2>
          <p>
            Menu assignments for **today and past days or weeks** are locked and
            cannot be modified.
          </p>
          <p>
            **Tomorrow** can be editable if it falls on a weekday within the
            current week.
          </p>
          <p>All days in **future weeks** are editable.</p>
          <p className="mt-2">
            <span className="text-green-600 font-semibold">
              Green "Editable"
            </span>{" "}
            : Day can be assigned/modified
          </p>
          <p>
            <span className="text-gray-500 font-semibold">Gray "Locked"</span>:
            Assignment window has closed for this day
          </p>
          <p className="mt-2 text-sm font-medium">
            **Note**: Clicking a week (the leftmost column) will open the
            assignment modal only if there is at least one editable day within
            that week.
          </p>
        </div>

        {/* Menu Templates Section */}
        <div className="mt-10 border rounded-xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-4">
              Available Menu Templates
            </h2>
            <Button
              size="sm"
              onClick={() => setIsCreateTemplateModalOpen(true)}
            >
              + New Template
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 cursor-pointer">
            {menuTemplates?.map((template) => {
              console.log(template.id);

              return (
                <div
                  key={template.id}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200 ease-in-out flex flex-col text-gray-800 overflow-hidden"
                >
                  {/* Top Section: Name and Emoji */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold flex-grow pr-2 break-words">
                      {template.menuName}
                    </h3>
                    {template.emoji || (
                      <div
                        className="text-2xl"
                        role="img"
                        aria-label={template.menuName}
                      >
                        {template.menuType === "VEG" && (
                          <Salad stroke="green" />
                        )}
                        {template.menuType === "NON_VEG" && (
                          <Ham stroke="red" />
                        )}
                        {template.menuType === "BOTH" && (
                          <UtensilsCrossed stroke="orange" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 items-center">
                    {/* Optional Description */}
                    <p className="text-sm text-gray-600">
                      {template.description}
                    </p>
                    <span className="w-fit bg-amber-100 text-slate-800 text-[9.5px] py-[0.1rem] px-4 rounded-md shadow-sm self-center font-semibold">
                      {template.menuType}
                    </span>
                  </div>
                  {/* Menu Items */}
                  <p className="text-sm mt-4">
                    <span className="font-medium">Items:</span>{" "}
                    {template.menuItems}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modals */}
        {/* Week Menu Assignment Modal */}
        {isWeekMenuModalOpen && selectedWeekData && (
          <WeekMenuModal
            isModalOpen={isWeekMenuModalOpen}
            setIsModalOpen={setIsWeekMenuModalOpen}
            weekData={selectedWeekData}
            menuTemplates={menuTemplates}
            onSave={handleSaveWeekAssignment}
          />
        )}

        {/* Create New Template Modal */}
        {isCreateTemplateModalOpen && (
          <CreateTemplateModal
            isOpen={isCreateTemplateModalOpen}
            setIsOpen={setIsCreateTemplateModalOpen}
            onSaveTemplate={handleCreateNewTemplate}
          />
        )}
      </div>
    </Layout>
  );
}
