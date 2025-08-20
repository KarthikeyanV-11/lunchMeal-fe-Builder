import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Edit3,
  CalendarDays,
} from "lucide-react";
import { Layout } from "../../components/shared/Layout";
import { useAuth } from "../../contexts/AuthContext";
import WeekMenuModal from "../../components/ui/WeekMenuModal";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../../components/ui/Loader";
import { GiHotMeal } from "react-icons/gi";

export default function MenuAssignmentCalendar() {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [weeks, setWeeks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Holidays Set for YYYY-MM-DD, and a list with descriptions if you want to show tooltips etc
  const [holidays, setHolidays] = useState(new Set());

  // State for the Weekly Menu Assignment Modal
  const [isWeekMenuModalOpen, setIsWeekMenuModalOpen] = useState(false);
  const [selectedWeekData, setSelectedWeekData] = useState(null);
  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    // Fetch holidays for current month and year
    const fetchHolidays = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/holiday/getHolidaysByMonthAndYear?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`,
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        // Filter status === "true" and collect date string ("YYYY-MM-DD")
        setHolidays(
          new Set(data.filter((h) => h.status === "true").map((h) => h.date)),
        );
      } catch (error) {
        console.error("Failed to fetch holidays:", error);
        setHolidays(new Set()); // fallback to empty
      }
    };

    // build weeks as before
    const generateWeeks = () => {
      const result = [];
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const dayOfWeek = firstDayOfMonth.getDay(); // Sunday=0 ... Saturday=6
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
        const monday = weekDates[0];
        const friday = weekDates[4];
        const rangeLabel = `${formatDisplayDate(monday)} - ${formatDisplayDate(friday)}`;
        const dayEditability = {
          monday: isDayEditable(weekDates[0], false),
          tuesday: isDayEditable(weekDates[1], false),
          wednesday: isDayEditable(weekDates[2], false),
          thursday: isDayEditable(weekDates[3], false),
          friday: isDayEditable(weekDates[4], false),
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
          isDayEditable: dayEditability,
        });
      }
      setWeeks(result);
    };

    // The menus logic remains same, you'll lock via the Set in render logic below
    const fetchMonthlyMenu = async () => {
      try {
        setLoading(true);
        const result = [];
        const firstDayOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1,
        );
        const dayOfWeek = firstDayOfMonth.getDay();
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
          const monday = weekDates[0];
          const friday = weekDates[4];
          const rangeLabel = `${formatDisplayDate(monday)} - ${formatDisplayDate(friday)}`;
          const dayEditability = {
            monday: isDayEditable(weekDates[0], false),
            tuesday: isDayEditable(weekDates[1], false),
            wednesday: isDayEditable(weekDates[2], false),
            thursday: isDayEditable(weekDates[3], false),
            friday: isDayEditable(weekDates[4], false),
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
            isDayEditable: dayEditability,
          });
        }
        // Step 2: Fetch assigned menus
        const res = await fetch(
          `${BASE_URL}/menuSchedule/byMonthAndYear?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`,
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const allSchedules = data.flatMap((week) =>
          ["monday", "tuesday", "wednesday", "thursday", "friday"]
            .map((day) => week[day])
            .filter(Boolean),
        );
        const updatedWeeks = result.map((week) => {
          const updatedAssignedMenus = { ...week.assignedMenus };
          week.dates.forEach((date) => {
            const formatted = date.toISOString().split("T")[0];
            const schedule = allSchedules.find(
              (entry) => entry?.date === formatted,
            );
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
            if (
              ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(
                day,
              )
            ) {
              updatedAssignedMenus[day] = schedule
                ? {
                    id: schedule.id,
                    menuName: schedule.menuName,
                    menuType: schedule.menuType,
                  }
                : null;
            }
          });
          return { ...week, assignedMenus: updatedAssignedMenus };
        });
        setWeeks(updatedWeeks);
      } catch (error) {
        console.error("Failed to fetch monthly menu:", error);
      } finally {
        setLoading(false);
      }
    };

    // sequential: fetch holidays, then generate weeks, then fetch menu
    const loadData = async () => {
      setLoading(true);
      await fetchHolidays();
      generateWeeks();
      await fetchMonthlyMenu();
      setLoading(false);
    };
    loadData();
    // eslint-disable-next-line
  }, [currentDate]); // re-fetches data when month changes

  const formatDisplayDate = (date) => {
    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const formatRouteDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate(),
    ).padStart(2, "0")}`;
  };

  // Here you MUST check holidays Set for locking cells:
  const isDayEditable = (dateToCheck, holidayFlag = false) => {
    // Use the fetched holidays list for lock regardless of "holidayFlag" param
    const formatted = formatRouteDate(dateToCheck);
    if (holidays.has(formatted)) return false;
    // You could remove the holidayFlag param if you want.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const checkedDate = new Date(dateToCheck);
    checkedDate.setHours(0, 0, 0, 0);
    if (checkedDate <= today) return false;
    if (checkedDate.getTime() === tomorrow.getTime()) return true;
    if (checkedDate > tomorrow) return true;
    return false;
  };

  // Week range editable if at least one week day (Mon-Fri) is editable (again check against holiday Set inside isDayEditable)
  const isWeekRangeEditable = (weekDates) => {
    if (!Array.isArray(weekDates) || weekDates.length === 0) return false;
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
  const menuTemplates = useSelector((state) => state.menu.availableTemplates);

  const handleWeekClick = (week) => {
    const editable = isWeekRangeEditable(week.dates);
    if (editable) {
      setSelectedWeekData(week);
      setIsWeekMenuModalOpen(true);
    } else {
      console.log("This week has no editable days for menu assignment.");
    }
  };

  const handleSaveWeekAssignment = async (weekToUpdate, newAssignments) => {
    const formatDateLocal = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate(),
      ).padStart(2, "0")}`;
    const startDate = formatDateLocal(weekToUpdate.dates[0]);
    const endDate = formatDateLocal(weekToUpdate.dates[4]);
    const existingWeek =
      weeks.find(
        (w) =>
          formatDateLocal(w.dates[0]) === startDate &&
          formatDateLocal(w.dates[4]) === endDate,
      ) || weekToUpdate;
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const mergedAssignments = { startDate, endDate };
    days.forEach((day) => {
      const newAssigned = newAssignments?.[day];
      const existingAssigned = existingWeek?.assignedMenus?.[day];
      const newId =
        typeof newAssigned === "object" && newAssigned !== null
          ? newAssigned.id
          : typeof newAssigned === "number"
            ? newAssigned
            : null;
      const existingId =
        typeof existingAssigned === "object" && existingAssigned !== null
          ? existingAssigned.id
          : typeof existingAssigned === "number"
            ? existingAssigned
            : null;
      // You can add: skip if holidays.has(date) here if you want to avoid API call for holidays
      if (
        weekToUpdate.dates &&
        holidays.has(formatRouteDate(weekToUpdate.dates[days.indexOf(day)]))
      ) {
        mergedAssignments[day] = null; // Explicitly do not assign for holiday
      } else if (newId !== null && newId !== undefined) {
        mergedAssignments[day] = newId;
      } else if (existingId !== null && existingId !== undefined) {
        mergedAssignments[day] = existingId;
      } else {
        mergedAssignments[day] = null;
      }
    });
    try {
      const response = await fetch(`${BASE_URL}/menuSchedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mergedAssignments),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to save menu assignments: ${errorData.message || response.statusText}`,
        );
      }
      const data = await response.json();
      setWeeks((prevWeeks) =>
        prevWeeks.map((week) => {
          const start = formatDateLocal(week.dates[0]);
          const end = formatDateLocal(week.dates[4]);
          if (start === startDate && end === endDate) {
            const updatedMenus = {};
            days.forEach((day) => {
              updatedMenus[day] = data[day] ?? null;
            });
            return { ...week, assignedMenus: updatedMenus };
          }
          return week;
        }),
      );
    } catch (error) {
      console.error("❌ Error saving menu assignments:", error);
    }
    setIsWeekMenuModalOpen(false);
    setSelectedWeekData(null);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        {/* Header with Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded text-orange-400 flex items-center justify-center">
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
          {loading ? (
            <div className="flex items-center justify-center h-screen">
              <Loader />
            </div>
          ) : (
            <>
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
                const isAnyDayEditableInWeek = isWeekRangeEditable(week.dates);
                return (
                  <div
                    key={index}
                    className={`grid grid-cols-6 border-b border-gray-200 last:border-b-0`}
                  >
                    {/* Week Label Column with onClick for WeekMenuModal */}
                    <div
                      className={`p-4 border-r border-gray-200 flex flex-col cursor-pointer ${
                        isAnyDayEditableInWeek
                          ? "hover:bg-gray-50"
                          : "opacity-80"
                      }`}
                      onClick={() => handleWeekClick(week)}
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
                      const dayKey = dayLabels[idx]?.toLowerCase();
                      const assignedMenu = week.assignedMenus[dayKey];
                      const formattedDate = formatRouteDate(date);

                      // --- Key change: holidaySet logic
                      const isHoliday = holidays.has(formattedDate);
                      const editableDay = isDayEditable(date);

                      return (
                        <div
                          key={idx}
                          className={`relative p-4 border-r border-gray-200 last:border-r-0 text-center hover:bg-gray-50 cursor-pointer ${
                            !editableDay ? "opacity-50" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isHoliday && editableDay) {
                              navigate(`/menu/${role}/${formattedDate}`);
                            }
                          }}
                        >
                          {/* Small date in top-right */}
                          <span className="absolute top-1 right-2 text-xs font-semibold text-gray-800">
                            {new Date(date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </span>
                          <div className="mt-3 flex flex-col items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <div className="text-gray-400 text-lg">
                                <GiHotMeal
                                  size={25}
                                  className="text-orange-400"
                                />
                              </div>
                            </div>
                            <span className="text-sm text-orange-600 mb-1 font-bold">
                              {assignedMenu
                                ? assignedMenu.menuName
                                : "Not assigned"}
                              {isHoliday && (
                                <span
                                  className="text-sm text-red-500 font-semibold"
                                  style={{ display: "block" }}
                                >
                                  Holiday
                                </span>
                              )}
                            </span>
                            <div className="flex items-center gap-1">
                              {editableDay && !isHoliday ? (
                                <Edit3 className="w-3 h-3 text-green-500" />
                              ) : (
                                <Lock className="w-3 h-3 text-gray-400" />
                              )}
                              <span className="text-xs font-semibold text-gray-800">
                                {editableDay && !isHoliday
                                  ? "Editable"
                                  : "Locked"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </>
          )}
        </div>
        {/* Access Policy */}
        <div className="bg-orange-200 text-gray-900 p-4 rounded-md mt-6 text-sm">
          <h2 className="font-semibold mb-1">Access Control Policy</h2>
          <p>
            Menu assignments for <b>today and past days or weeks</b> are locked
            and cannot be modified.
          </p>
          <p>
            <b>Tomorrow</b> can be editable if it falls on a weekday within the
            current week.
          </p>
          <p>
            All days in <b>future weeks</b> are editable.
          </p>
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
            <b>Note</b>: Holidays are always{" "}
            <span className="text-red-500 font-semibold">Locked</span>. Clicking
            a week (the leftmost column) will open the assignment modal only if
            there is at least one editable day within that week.
          </p>
        </div>
        {/* Modals */}
        {isWeekMenuModalOpen && selectedWeekData && (
          <WeekMenuModal
            isModalOpen={isWeekMenuModalOpen}
            setIsModalOpen={setIsWeekMenuModalOpen}
            weekData={selectedWeekData}
            menuTemplates={menuTemplates}
            onSave={handleSaveWeekAssignment}
            holidays={holidays} // pass the Set from calendar's state
          />
        )}
      </div>
    </Layout>
  );
}
