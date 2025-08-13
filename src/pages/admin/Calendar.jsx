// // src/components/ui/AdminWeekViewCalendar.jsx
// import React, { useState, useEffect } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Lock,
//   Edit3,
//   CalendarDays,
//   Vegan,
//   UtensilsCrossed,
//   Salad,
//   Ham,
// } from "lucide-react";
// import { Layout } from "../../components/shared/Layout";
// import { useAuth } from "../../contexts/AuthContext";
// import { Button } from "../../components/ui/Button";
// import WeekMenuModal from "../../components/ui/WeekMenuModal";
// import CreateTemplateModal from "../../components/ui/CreateTemplateModal";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { RefreshCw } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { setNewTemplate } from "../../slice/menuSlice";
// import Loader from "../../components/ui/Loader";
// import axios from "axios";

// export default function AdminWeekViewCalendar() {
//   const BASE_URL = import.meta.env.VITE_BACKEND_URL;

//   const [weeks, setWeeks] = useState([]);
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [loading, setLoading] = useState(false);

//   // State for the Weekly Menu Assignment Modal
//   const [isWeekMenuModalOpen, setIsWeekMenuModalOpen] = useState(false);
//   // State for the Create New Template Modal
//   const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] =
//     useState(false);

//   // New state to hold data for the selected week to be passed to the WeekMenuModal
//   const [selectedWeekData, setSelectedWeekData] = useState(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { role } = useAuth();

//   // useEffect(() => {
//   //   const generateWeeks = () => {
//   //     const result = [];

//   //     const firstDayOfMonth = new Date(
//   //       currentDate.getFullYear(),
//   //       currentDate.getMonth(),
//   //       1,
//   //     );
//   //     const dayOfWeek = firstDayOfMonth.getDay(); // Sunday=0 ... Saturday=6

//   //     // Calculate Monday on or before the first day of this month
//   //     const currentMonday = new Date(firstDayOfMonth);
//   //     currentMonday.setDate(
//   //       firstDayOfMonth.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1),
//   //     );

//   //     for (let i = 0; i < 5; i++) {
//   //       const weekStart = new Date(currentMonday);
//   //       weekStart.setDate(currentMonday.getDate() + i * 7);

//   //       const weekDates = [];
//   //       for (let d = 0; d < 7; d++) {
//   //         const date = new Date(weekStart);
//   //         date.setDate(weekStart.getDate() + d);
//   //         weekDates.push(date);
//   //       }

//   //       const monday = weekDates[0]; // Monday is index 0
//   //       const friday = weekDates[4]; // Friday is index 4
//   //       const rangeLabel = `${formatDisplayDate(monday)} - ${formatDisplayDate(friday)}`;

//   //       // Calculate individual day editability for the modal
//   //       const dayEditability = {
//   //         monday: isDayEditable(weekDates[0]),
//   //         tuesday: isDayEditable(weekDates[1]),
//   //         wednesday: isDayEditable(weekDates[2]),
//   //         thursday: isDayEditable(weekDates[3]),
//   //         friday: isDayEditable(weekDates[4]),
//   //       };

//   //       result.push({
//   //         range: rangeLabel,
//   //         dates: weekDates,
//   //         assignedMenus: {
//   //           monday: null,
//   //           tuesday: null,
//   //           wednesday: null,
//   //           thursday: null,
//   //           friday: null,
//   //         },
//   //         // IMPORTANT: Add the isDayEditable map here
//   //         isDayEditable: dayEditability,
//   //       });
//   //     }

//   //     setWeeks(result);
//   //   };

//   //   const fetchMonthlyMenu = async () => {
//   //     try {
//   //       const res = await fetch(
//   //         `${BASE_URL}/menuSchedule/byMonthAndYear?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`,
//   //       );

//   //       console.log("API Response:", res);

//   //       if (!res.ok) {
//   //         throw new Error(`HTTP error! status: ${res.status}`);
//   //       }

//   //       const data = await res.json();
//   //       console.log("Fetched Data:", data); // 👀 See the raw API data

//   //       const allSchedules = data.flatMap((week) =>
//   //         ["monday", "tuesday", "wednesday", "thursday", "friday"]
//   //           .map((day) => week[day])
//   //           .filter(Boolean),
//   //       );

//   //       console.log("Flattened Schedules (Mon–Fri):", allSchedules);

//   //       setWeeks((prevWeeks) =>
//   //         prevWeeks.map((week, index) => {
//   //           const updatedAssignedMenus = { ...week.assignedMenus };

//   //           console.log(`\n--- Week ${index + 1} ---`);
//   //           week.dates.forEach((date) => {
//   //             const formatted = date.toISOString().split("T")[0]; // UTC date string as before
//   //             const schedule = allSchedules.find(
//   //               (entry) => entry?.date === formatted,
//   //             );

//   //             console.log(`Checking date: ${formatted}`);
//   //             if (schedule) {
//   //               // Use UTC day index to get the day clearly without timezone issues
//   //               // 0=Sunday, 1=Monday, ..., 6=Saturday
//   //               const dayIndex = date.getUTCDay();
//   //               const weekdays = [
//   //                 "sunday",
//   //                 "monday",
//   //                 "tuesday",
//   //                 "wednesday",
//   //                 "thursday",
//   //                 "friday",
//   //                 "saturday",
//   //               ];
//   //               const day = weekdays[dayIndex];

//   //               console.log(`→ Found match on ${day}:`, schedule);

//   //               // Only assign menus for Monday through Friday as before
//   //               if (
//   //                 [
//   //                   "monday",
//   //                   "tuesday",
//   //                   "wednesday",
//   //                   "thursday",
//   //                   "friday",
//   //                 ].includes(day)
//   //               ) {
//   //                 updatedAssignedMenus[day] = {
//   //                   menuName: schedule.menuName,
//   //                   menuType: schedule.menuType,
//   //                 };
//   //               }
//   //             } else {
//   //               console.log(`→ No match found for ${formatted}`);
//   //             }
//   //           });

//   //           return {
//   //             ...week,
//   //             assignedMenus: updatedAssignedMenus,
//   //           };
//   //         }),
//   //       );
//   //     } catch (error) {
//   //       console.error("Failed to fetch monthly menu:", error);
//   //     }
//   //   };

//   //   generateWeeks();
//   //   fetchMonthlyMenu();
//   // }, [currentDate]);

//   useEffect(() => {
//     const fetchMonthlyMenu = async () => {
//       try {
//         setLoading(true);
//         // Step 1: Generate week structure fresh
//         const result = [];
//         const firstDayOfMonth = new Date(
//           currentDate.getFullYear(),
//           currentDate.getMonth(),
//           1,
//         );
//         const dayOfWeek = firstDayOfMonth.getDay(); // Sunday=0 ... Saturday=6

//         const currentMonday = new Date(firstDayOfMonth);
//         currentMonday.setDate(
//           firstDayOfMonth.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1),
//         );

//         for (let i = 0; i < 5; i++) {
//           const weekStart = new Date(currentMonday);
//           weekStart.setDate(currentMonday.getDate() + i * 7);

//           const weekDates = [];
//           for (let d = 0; d < 7; d++) {
//             const date = new Date(weekStart);
//             date.setDate(weekStart.getDate() + d);
//             weekDates.push(date);
//           }

//           const monday = weekDates[0];
//           const friday = weekDates[4];
//           const rangeLabel = `${formatDisplayDate(monday)} - ${formatDisplayDate(friday)}`;

//           const holidayChecks = await Promise.all(
//             weekDates.slice(0, 5).map(async (date) => {
//               const dateStr = formatRouteDate(date);
//               try {
//                 const res = await axios.get(`${BASE_URL}/holiday/isHoliday`, {
//                   params: { date: dateStr },
//                 });
//                 return res.data; // API returns true or false
//               } catch (err) {
//                 console.error(`Holiday API error for ${dateStr}:`, err);
//                 return false;
//               }
//             }),
//           );

//           const holidayMap = {
//             monday: holidayChecks[0],
//             tuesday: holidayChecks[1],
//             wednesday: holidayChecks[2],
//             thursday: holidayChecks[3],
//             friday: holidayChecks[4],
//           };

//           const dayEditability = {
//             monday: isDayEditable(weekDates[0]),
//             tuesday: isDayEditable(weekDates[1]),
//             wednesday: isDayEditable(weekDates[2]),
//             thursday: isDayEditable(weekDates[3]),
//             friday: isDayEditable(weekDates[4]),
//           };

//           result.push({
//             range: rangeLabel,
//             dates: weekDates,
//             assignedMenus: {
//               monday: null,
//               tuesday: null,
//               wednesday: null,
//               thursday: null,
//               friday: null,
//             },
//             isDayEditable: dayEditability,
//             isHoliday: holidayMap,
//           });
//         }

//         // Step 2: Fetch assigned menus
//         const res = await fetch(
//           `${BASE_URL}/menuSchedule/byMonthAndYear?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`,
//         );

//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }

//         const data = await res.json();
//         const allSchedules = data.flatMap((week) =>
//           ["monday", "tuesday", "wednesday", "thursday", "friday"]
//             .map((day) => week[day])
//             .filter(Boolean),
//         );

//         // Step 3: Assign menus to generated weeks
//         const updatedWeeks = result.map((week) => {
//           const updatedAssignedMenus = { ...week.assignedMenus };

//           week.dates.forEach((date) => {
//             const formatted = date.toISOString().split("T")[0];
//             const schedule = allSchedules.find(
//               (entry) => entry?.date === formatted,
//             );

//             const dayIndex = date.getUTCDay();
//             const weekdays = [
//               "sunday",
//               "monday",
//               "tuesday",
//               "wednesday",
//               "thursday",
//               "friday",
//               "saturday",
//             ];
//             const day = weekdays[dayIndex];

//             if (
//               ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(
//                 day,
//               )
//             ) {
//               if (schedule) {
//                 updatedAssignedMenus[day] = {
//                   id: schedule.id,
//                   menuName: schedule.menuName,
//                   menuType: schedule.menuType,
//                 };
//               } else {
//                 updatedAssignedMenus[day] = null;
//               }
//             }
//           });

//           return {
//             ...week,
//             assignedMenus: updatedAssignedMenus,
//           };
//         });

//         // Step 4: Update UI state
//         setWeeks(updatedWeeks);
//       } catch (error) {
//         console.error("Failed to fetch monthly menu:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMonthlyMenu();
//   }, [currentDate]);

//   const formatDisplayDate = (date) => {
//     const options = { month: "short", day: "numeric" };
//     return date.toLocaleDateString("en-US", options);
//   };

//   const formatRouteDate = (date) => {
//     return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
//       date.getDate(),
//     ).padStart(2, "0")}`;
//   };

//   // --- NEW isDayEditable FUNCTION (from your provided code) ---
//   const isDayEditable = (dateToCheck) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Normalize today's date to start of day

//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);
//     tomorrow.setHours(0, 0, 0, 0); // Normalize tomorrow's date

//     const checkedDate = new Date(dateToCheck);
//     checkedDate.setHours(0, 0, 0, 0); // Normalize the date being checked

//     // Rule 1: Today and past days are not editable
//     if (checkedDate <= today) {
//       return false;
//     }

//     // Rule 2: Tomorrow is editable
//     if (checkedDate.getTime() === tomorrow.getTime()) {
//       return true;
//     }

//     // Rule 3: Next days or weeks are editable
//     if (checkedDate > tomorrow) {
//       return true;
//     }

//     return false;
//   };

//   // --- MODIFIED isWeekRangeEditable FUNCTION (for modal trigger) ---
//   const isWeekRangeEditable = (weekDates) => {
//     if (!Array.isArray(weekDates) || weekDates.length === 0) return false;

//     // A week is editable if at least one day in it (Monday to Friday)
//     // is editable according to the new `isDayEditable` logic.
//     // We only care about Monday to Friday for menu assignments.
//     return weekDates.slice(0, 5).some((date) => isDayEditable(date));
//   };

//   const goToPreviousMonth = () => {
//     setCurrentDate(
//       (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
//     );
//   };

//   const goToNextMonth = () => {
//     setCurrentDate(
//       (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
//     );
//   };

//   const getCurrentMonthYear = () => {
//     const options = { month: "long", year: "numeric" };
//     return currentDate.toLocaleDateString("en-US", options);
//   };

//   const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

//   // This list would ideally come from an API or a global state
//   // const [menuTemplates] = useSelector((state) => state.menu.availableTemplates);
//   const menuTemplates = useSelector((state) => state.menu.availableTemplates);

//   console.log(menuTemplates);

//   const handleWeekClick = (week) => {
//     // We now check if the week has *any* editable days to open the modal
//     const editable = isWeekRangeEditable(week.dates);

//     if (editable) {
//       setSelectedWeekData(week);
//       setIsWeekMenuModalOpen(true);
//     } else {
//       // Replaced alert with a console.log, as per instructions to avoid alert()
//       console.log("This week has no editable days for menu assignment.");
//       // You might want to implement a custom message box here instead of console.log
//       // For example: show a temporary notification or a custom modal.
//     }
//   };

//   // Function to handle saving assignments from the WeekMenuModal (to be passed to modal)
//   // Inside AdminWeekViewCalendar.jsx

//   // const handleSaveWeekAssignment = async (weekToUpdate, assignments) => {
//   //   console.log(
//   //     "Saving assignments for week:",
//   //     weekToUpdate.range,
//   //     assignments,
//   //   );

//   //   // OPTIONAL: Optimistic UI update (kept for immediate feedback)
//   //   setWeeks((prevWeeks) =>
//   //     prevWeeks.map((week) =>
//   //       week.range === weekToUpdate.range
//   //         ? { ...week, assignedMenus: assignments }
//   //         : week,
//   //     ),
//   //   );

//   //   // --- THIS IS THE CRITICAL PART YOU NEED TO ADD/MODIFY ---
//   //   try {
//   //     const response = await fetch(`${BASE_URL}/menuSchedule`, {
//   //       // <--- IMPORTANT: Adjust this endpoint to your actual backend API
//   //       method: "POST", // Or 'PUT' depending on your backend's design
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //         // Add any authentication headers if your API requires them (e.g., 'Authorization': `Bearer ${yourAuthToken}`)
//   //       },
//   //       body: JSON.stringify({
//   //         // You need to send data in a format your backend expects to identify the week and update assignments
//   //         startDate: weekToUpdate.dates[0].toISOString().split("T")[0], // Example: Send the Monday's date
//   //         // endDa
//   //         assignments: assignments, // The object containing monday, tuesday, etc. menu details
//   //       }),
//   //     });
//   //     console.log(response);

//   //     if (!response.ok) {
//   //       const errorData = await response.json(); // Try to get error message from backend
//   //       throw new Error(
//   //         `Failed to save menu assignments: ${errorData.message || response.statusText}`,
//   //       );
//   //     }

//   //     console.log("Menu assignments successfully saved to backend.");

//   //     // After successful save to backend, re-fetch to ensure calendar is in sync
//   //     await fetchMonthlyMenu();
//   //   } catch (error) {
//   //     console.error("Error saving menu assignments:", error);
//   //     // TODO: Implement user-facing error feedback (e.g., a toast notification)
//   //     // If you did an optimistic update, you might want to revert it here if the save failed.
//   //   }

//   //   // Close the modal and clear selected data regardless of save success/failure
//   //   setIsWeekMenuModalOpen(false);
//   //   setSelectedWeekData(null);
//   // };

//   // const handleSaveWeekAssignment = async (weekToUpdate, newAssignments) => {
//   //   console.log(
//   //     "Saving assignments for week:",
//   //     weekToUpdate.range,
//   //     newAssignments,
//   //   );

//   //   const formatDateLocal = (date) => {
//   //     return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
//   //   };

//   //   const startDate = formatDateLocal(weekToUpdate.dates[0]);
//   //   const endDate = formatDateLocal(weekToUpdate.dates[4]);

//   //   const existingWeek = weeks.find(
//   //     (w) =>
//   //       formatDateLocal(w.dates[0]) === startDate &&
//   //       formatDateLocal(w.dates[4]) === endDate,
//   //   );

//   //   const mergedAssignments = {
//   //     startDate,
//   //     endDate,
//   //   };

//   //   const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

//   //   // Merge new assignments with existing
//   //   days.forEach((day) => {
//   //     if (newAssignments[day]?.id) {
//   //       mergedAssignments[day] = newAssignments[day].id;
//   //     } else if (existingWeek?.assignedMenus?.[day]?.id) {
//   //       mergedAssignments[day] = existingWeek.assignedMenus[day].id;
//   //     }
//   //   });

//   //   try {
//   //     const response = await fetch(`${BASE_URL}/menuSchedule`, {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify(mergedAssignments),
//   //     });

//   //     if (!response.ok) {
//   //       const errorData = await response.json();
//   //       throw new Error(
//   //         `Failed to save menu assignments: ${errorData.message || response.statusText}`,
//   //       );
//   //     }

//   //     console.log("Menu assignments successfully saved to backend.");

//   //     // ✅ Update local weeks state immediately
//   //     const updatedWeeks = weeks.map((week) => {
//   //       if (
//   //         formatDateLocal(week.dates[0]) === startDate &&
//   //         formatDateLocal(week.dates[4]) === endDate
//   //       ) {
//   //         const updatedAssignedMenus = { ...week.assignedMenus };

//   //         days.forEach((day) => {
//   //           if (mergedAssignments[day]) {
//   //             updatedAssignedMenus[day] = { id: mergedAssignments[day] };
//   //           }
//   //         });

//   //         return {
//   //           ...week,
//   //           assignedMenus: updatedAssignedMenus,
//   //         };
//   //       }

//   //       return week;
//   //     });

//   //     setWeeks(updatedWeeks); // ⬅️ Reflect changes in the UI

//   //     setIsWeekMenuModalOpen(false);
//   //     setSelectedWeekData(null);

//   //     // Optional: Also fetch from backend if needed
//   //     // await fetchMonthlyMenu();
//   //   } catch (error) {
//   //     console.error("Error saving menu assignments:", error);
//   //   }
//   // };

//   const handleSaveWeekAssignment = async (weekToUpdate, newAssignments) => {
//     const formatDateLocal = (date) =>
//       `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

//     const startDate = formatDateLocal(weekToUpdate.dates[0]);
//     const endDate = formatDateLocal(weekToUpdate.dates[4]);

//     // ✅ fallback to modal state if not found in weeks state
//     const existingWeek =
//       weeks.find(
//         (w) =>
//           formatDateLocal(w.dates[0]) === startDate &&
//           formatDateLocal(w.dates[4]) === endDate,
//       ) || weekToUpdate;

//     const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

//     const mergedAssignments = {
//       startDate,
//       endDate,
//     };

//     // 🔁 Always loop through all weekdays
//     days.forEach((day) => {
//       const newAssigned = newAssignments?.[day];
//       const existingAssigned = existingWeek?.assignedMenus?.[day];

//       const newId =
//         typeof newAssigned === "object" && newAssigned !== null
//           ? newAssigned.id
//           : typeof newAssigned === "number"
//             ? newAssigned
//             : null;

//       const existingId =
//         typeof existingAssigned === "object" && existingAssigned !== null
//           ? existingAssigned.id
//           : typeof existingAssigned === "number"
//             ? existingAssigned
//             : null;

//       // 🧠 Priority: New → Existing → null
//       if (newId !== null && newId !== undefined) {
//         mergedAssignments[day] = newId;
//       } else if (existingId !== null && existingId !== undefined) {
//         mergedAssignments[day] = existingId;
//       } else {
//         // You can still send null if truly unassigned
//         mergedAssignments[day] = null;
//       }
//     });

//     console.log("📦 Final mergedAssignments payload:", mergedAssignments);

//     try {
//       const response = await fetch(`${BASE_URL}/menuSchedule`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(mergedAssignments),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           `Failed to save menu assignments: ${errorData.message || response.statusText}`,
//         );
//       }

//       const data = await response.json();
//       console.log("Fetched data : ", data);

//       console.log("✅ Menu assignments saved successfully.");

//       // 🔄 Update local state
//       // setWeeks((prevWeeks) =>
//       //   prevWeeks.map((week) => {
//       //     const start = formatDateLocal(week.dates[0]);
//       //     const end = formatDateLocal(week.dates[4]);

//       //     if (start === startDate && end === endDate) {
//       //       const updatedMenus = {};

//       //       days.forEach((day) => {
//       //         const selectedTemplate = newAssignments[day];
//       //         const fallback = existingWeek?.assignedMenus?.[day];

//       //         updatedMenus[day] = selectedTemplate ?? fallback ?? null;
//       //       });

//       //       return {
//       //         ...week,
//       //         assignedMenus: updatedMenus,
//       //       };
//       //     }

//       //     return week;
//       //   }),
//       // );
//       setWeeks((prevWeeks) =>
//         prevWeeks.map((week) => {
//           const start = formatDateLocal(week.dates[0]);
//           const end = formatDateLocal(week.dates[4]);

//           if (start === startDate && end === endDate) {
//             // Use backend-provided values directly
//             const updatedMenus = {};
//             days.forEach((day) => {
//               updatedMenus[day] = data[day] ?? null; // keep null exactly as backend sends it
//             });

//             return {
//               ...week,
//               assignedMenus: updatedMenus,
//             };
//           }
//           return week;
//         }),
//       );
//     } catch (error) {
//       console.error("❌ Error saving menu assignments:", error);
//     }

//     setIsWeekMenuModalOpen(false);
//     setSelectedWeekData(null);
//   };

//   const handleCreateNewTemplate = (templateData) => {
//     console.log("Creating new template:", templateData);

//     dispatch(setNewTemplate(templateData)); // ✅ immediately update Redux state

//     setIsCreateTemplateModalOpen(false);
//   };

//   // if (loading) {
//   //   return (
//   //     <div className="flex items-center justify-center h-screen">
//   //       <Loader />
//   //     </div>
//   //   );
//   // }

//   return (
//     <Layout>
//       <div className="max-w-5xl mx-auto p-6">
//         {/* Header with Month Navigation */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <div className="w-6 h-6 rounded text-orange-400 flex items-center justify-center">
//               <div>
//                 <CalendarDays />
//               </div>
//             </div>
//             <h1 className="text-3xl font-bold text-gray-800">
//               Menu Assignment Calendar
//             </h1>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               className="p-2 hover:bg-gray-200 rounded"
//               onClick={goToPreviousMonth}
//             >
//               <ChevronLeft className="w-5 h-5" />
//             </button>
//             <span className="px-4 py-1 text-lg font-medium">
//               {getCurrentMonthYear()}
//             </span>
//             <button
//               className="p-2 hover:bg-gray-200 rounded"
//               onClick={goToNextMonth}
//             >
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Calendar Grid */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//           {loading ? (
//             <div className="flex items-center justify-center h-screen">
//               <Loader />
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-6 border-b border-gray-200">
//                 <div className="p-4 font-medium text-gray-700 border-r border-gray-200">
//                   Week
//                 </div>
//                 {dayLabels.map((day) => (
//                   <div
//                     key={day}
//                     className="p-4 font-medium text-gray-700 text-center border-r border-gray-200 last:border-r-0"
//                   >
//                     {day}
//                   </div>
//                 ))}
//               </div>
//               {weeks.map((week, index) => {
//                 const isAnyDayEditableInWeek = isWeekRangeEditable(week.dates); // Use this for overall week lock
//                 return (
//                   <div
//                     key={index}
//                     className={`grid grid-cols-6 border-b border-gray-200 last:border-b-0`}
//                   >
//                     {/* Week Label Column with onClick for WeekMenuModal */}
//                     <div
//                       className={`p-4 border-r border-gray-200 flex flex-col cursor-pointer ${
//                         isAnyDayEditableInWeek
//                           ? "hover:bg-gray-50"
//                           : "opacity-70"
//                       }`}
//                       onClick={() => {
//                         if (isAnyDayEditableInWeek) {
//                           setSelectedWeekData(week);
//                           setIsWeekMenuModalOpen(true);
//                         } else {
//                           console.log(
//                             "This week has no editable days for menu assignment.",
//                           );
//                         }
//                       }}
//                     >
//                       <div className="font-medium text-gray-800 mb-2">
//                         {week.range}
//                       </div>
//                       <div className="flex items-center gap-2">
//                         {isAnyDayEditableInWeek ? (
//                           <>
//                             <Edit3 className="w-4 h-4 text-green-500" />
//                             <span className="text-sm text-green-600 font-medium">
//                               Editable
//                             </span>
//                           </>
//                         ) : (
//                           <>
//                             <Lock className="w-4 h-4 text-gray-400" />
//                             <span className="text-sm text-gray-500 font-medium">
//                               Locked
//                             </span>
//                           </>
//                         )}
//                       </div>
//                     </div>

//                     {/* Day Columns (Mon–Fri) */}
//                     {week.dates.slice(0, 5).map((date, idx) => {
//                       const dayKey = dayLabels[idx]?.toLowerCase(); // e.g., 'monday'
//                       const assignedMenu = week.assignedMenus[dayKey];
//                       const formattedDate = formatRouteDate(date);
//                       const editableDay = isDayEditable(date); // Check individual day's editability

//                       return (
//                         <div
//                           key={idx}
//                           className={`relative p-4 border-r border-gray-200 last:border-r-0 text-center hover:bg-gray-50 cursor-pointer ${
//                             !editableDay ? "opacity-70" : ""
//                           }`}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             navigate(`/menu/${role}/${formattedDate}`);
//                           }}
//                         >
//                           {/* Small date in top-right */}
//                           <span className="absolute top-1 right-2 text-xs font-semibold text-gray-800">
//                             {new Date(date).toLocaleDateString("en-GB", {
//                               day: "2-digit",
//                               month: "short",
//                             })}
//                           </span>

//                           <div className="mt-3 flex flex-col items-center gap-2">
//                             <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
//                               <div className="text-gray-400 text-lg mt-4">
//                                 <UtensilsCrossed />
//                               </div>
//                             </div>

//                             <span className="text-sm text-orange-400 mb-1 font-bold">
//                               {assignedMenu
//                                 ? assignedMenu.menuName
//                                 : "Not assigned"}
//                             </span>

//                             <div className="flex items-center gap-1">
//                               {editableDay ? (
//                                 <Edit3 className="w-3 h-3 text-green-500" />
//                               ) : (
//                                 <Lock className="w-3 h-3 text-gray-400" />
//                               )}
//                               <span className="text-xs font-semibold text-gray-800">
//                                 {editableDay ? "Editable" : "Locked"}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 );
//               })}
//             </>
//           )}
//         </div>

//         {/* <div className="flex justify-center items-center">
//           <Button className="mt-4 flex gap-2 justify-center items-center">
//             <RefreshCw className="w-4" /> <span>Sync</span>
//           </Button>
//         </div> */}

//         {/* Access Policy */}
//         <div className="bg-orange-200 text-gray-900 p-4 rounded-md mt-6 text-sm">
//           <h2 className="font-semibold mb-1">Access Control Policy</h2>
//           <p>
//             Menu assignments for **today and past days or weeks** are locked and
//             cannot be modified.
//           </p>
//           <p>
//             **Tomorrow** can be editable if it falls on a weekday within the
//             current week.
//           </p>
//           <p>All days in **future weeks** are editable.</p>
//           <p className="mt-2">
//             <span className="text-green-600 font-semibold">
//               Green "Editable"
//             </span>{" "}
//             : Day can be assigned/modified
//           </p>
//           <p>
//             <span className="text-gray-500 font-semibold">Gray "Locked"</span>:
//             Assignment window has closed for this day
//           </p>
//           <p className="mt-2 text-sm font-medium">
//             **Note**: Clicking a week (the leftmost column) will open the
//             assignment modal only if there is at least one editable day within
//             that week.
//           </p>
//         </div>

//         {/* Menu Templates Section */}
//         {/* <div className="mt-10 border rounded-xl p-4 shadow-sm hover:shadow-md transition">
//           <div className="flex justify-between">
//             <h2 className="text-xl font-semibold mb-4">
//               Available Menu Templates
//             </h2>
//             <Button
//               size="sm"
//               onClick={() => setIsCreateTemplateModalOpen(true)}
//             >
//               + New Template
//             </Button>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 cursor-pointer">
//             {menuTemplates?.map((template) => {
//               console.log(template.id);

//               return (
//                 <div
//                   key={template.id}
//                   className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200 ease-in-out flex flex-col text-gray-800 overflow-hidden"
//                 >

//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="text-xl font-semibold flex-grow pr-2 break-words">
//                       {template.menuName}
//                     </h3>
//                     {template.emoji || (
//                       <div
//                         className="text-2xl"
//                         role="img"
//                         aria-label={template.menuName}
//                       >
//                         {template.menuType === "VEG" && (
//                           <Salad stroke="green" />
//                         )}
//                         {template.menuType === "NON_VEG" && (
//                           <Ham stroke="red" />
//                         )}
//                         {template.menuType === "BOTH" && (
//                           <UtensilsCrossed stroke="orange" />
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex gap-4 items-center">

//                     <p className="text-sm text-gray-600">
//                       {template.description}
//                     </p>
//                     <span className="w-fit bg-amber-100 text-slate-800 text-[9.5px] py-[0.1rem] px-4 rounded-md shadow-sm self-center font-semibold">
//                       {template.menuType}
//                     </span>
//                   </div>

//                   <p className="text-sm mt-4">
//                     <span className="font-medium">Items:</span>{" "}
//                     {template.menuItems}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </div> */}

//         {/* Modals */}
//         {/* Week Menu Assignment Modal */}
//         {isWeekMenuModalOpen && selectedWeekData && (
//           <WeekMenuModal
//             isModalOpen={isWeekMenuModalOpen}
//             setIsModalOpen={setIsWeekMenuModalOpen}
//             weekData={selectedWeekData}
//             menuTemplates={menuTemplates}
//             onSave={handleSaveWeekAssignment}
//           />
//         )}

//         {/* Create New Template Modal */}
//         {/* {isCreateTemplateModalOpen && (
//           <CreateTemplateModal
//             isOpen={isCreateTemplateModalOpen}
//             setIsOpen={setIsCreateTemplateModalOpen}
//             onSaveTemplate={handleCreateNewTemplate}
//           />
//         )} */}
//       </div>
//     </Layout>
//   );
// }

// src/components/ui/AdminWeekViewCalendar.jsx
// src/components/ui/AdminWeekViewCalendar.jsx
// import React, { useState, useEffect } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Lock,
//   Edit3,
//   CalendarDays,
//   Vegan,
//   UtensilsCrossed,
//   Salad,
//   Ham,
//   Utensils,
// } from "lucide-react";
// import { Layout } from "../../components/shared/Layout";
// import { useAuth } from "../../contexts/AuthContext";
// import { Button } from "../../components/ui/Button";
// import WeekMenuModal from "../../components/ui/WeekMenuModal";
// import CreateTemplateModal from "../../components/ui/CreateTemplateModal";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { RefreshCw } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { setNewTemplate } from "../../slice/menuSlice";
// import Loader from "../../components/ui/Loader";
// import { GiHotMeal } from "react-icons/gi";

// export default function AdminWeekViewCalendar() {
//   const BASE_URL = import.meta.env.VITE_BACKEND_URL;

//   const [weeks, setWeeks] = useState([]);
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [loading, setLoading] = useState(false);

//   const [holidays, setHolidays] = useState(new Set());

//   // State for the Weekly Menu Assignment Modal
//   const [isWeekMenuModalOpen, setIsWeekMenuModalOpen] = useState(false);

//   // New state to hold data for the selected week to be passed to the WeekMenuModal
//   const [selectedWeekData, setSelectedWeekData] = useState(null);
//   const navigate = useNavigate();

//   const { role } = useAuth();

//   // useEffect(() => {
//   //   const generateWeeks = () => {
//   //     const result = [];

//   //     const firstDayOfMonth = new Date(
//   //       currentDate.getFullYear(),
//   //       currentDate.getMonth(),
//   //       1,
//   //     );
//   //     const dayOfWeek = firstDayOfMonth.getDay(); // Sunday=0 ... Saturday=6

//   //     // Calculate Monday on or before the first day of this month
//   //     const currentMonday = new Date(firstDayOfMonth);
//   //     currentMonday.setDate(
//   //       firstDayOfMonth.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1),
//   //     );

//   //     for (let i = 0; i < 5; i++) {
//   //       const weekStart = new Date(currentMonday);
//   //       weekStart.setDate(currentMonday.getDate() + i * 7);

//   //       const weekDates = [];
//   //       for (let d = 0; d < 7; d++) {
//   //         const date = new Date(weekStart);
//   //         date.setDate(weekStart.getDate() + d);
//   //         weekDates.push(date);
//   //       }

//   //       const monday = weekDates[0]; // Monday is index 0
//   //       const friday = weekDates[4]; // Friday is index 4
//   //       const rangeLabel = `${formatDisplayDate(monday)} - ${formatDisplayDate(friday)}`;

//   //       // Calculate individual day editability for the modal
//   //       const dayEditability = {
//   //         monday: isDayEditable(weekDates[0]),
//   //         tuesday: isDayEditable(weekDates[1]),
//   //         wednesday: isDayEditable(weekDates[2]),
//   //         thursday: isDayEditable(weekDates[3]),
//   //         friday: isDayEditable(weekDates[4]),
//   //       };

//   //       result.push({
//   //         range: rangeLabel,
//   //         dates: weekDates,
//   //         assignedMenus: {
//   //           monday: null,
//   //           tuesday: null,
//   //           wednesday: null,
//   //           thursday: null,
//   //           friday: null,
//   //         },
//   //         // IMPORTANT: Add the isDayEditable map here
//   //         isDayEditable: dayEditability,
//   //       });
//   //     }

//   //     setWeeks(result);
//   //   };

//   //   const fetchMonthlyMenu = async () => {
//   //     try {
//   //       setLoading(true);
//   //       // Step 1: Generate week structure fresh
//   //       const result = [];
//   //       const firstDayOfMonth = new Date(
//   //         currentDate.getFullYear(),
//   //         currentDate.getMonth(),
//   //         1,
//   //       );
//   //       const dayOfWeek = firstDayOfMonth.getDay(); // Sunday=0 ... Saturday=6

//   //       const currentMonday = new Date(firstDayOfMonth);
//   //       currentMonday.setDate(
//   //         firstDayOfMonth.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1),
//   //       );

//   //       for (let i = 0; i < 5; i++) {
//   //         const weekStart = new Date(currentMonday);
//   //         weekStart.setDate(currentMonday.getDate() + i * 7);

//   //         const weekDates = [];
//   //         for (let d = 0; d < 7; d++) {
//   //           const date = new Date(weekStart);
//   //           date.setDate(weekStart.getDate() + d);
//   //           weekDates.push(date);
//   //         }

//   //         const monday = weekDates[0];
//   //         const friday = weekDates[4];
//   //         const rangeLabel = `${formatDisplayDate(monday)} - ${formatDisplayDate(friday)}`;

//   //         const dayEditability = {
//   //           monday: isDayEditable(weekDates[0]),
//   //           tuesday: isDayEditable(weekDates[1]),
//   //           wednesday: isDayEditable(weekDates[2]),
//   //           thursday: isDayEditable(weekDates[3]),
//   //           friday: isDayEditable(weekDates[4]),
//   //         };

//   //         result.push({
//   //           range: rangeLabel,
//   //           dates: weekDates,
//   //           assignedMenus: {
//   //             monday: null,
//   //             tuesday: null,
//   //             wednesday: null,
//   //             thursday: null,
//   //             friday: null,
//   //           },
//   //           isDayEditable: dayEditability,
//   //         });
//   //       }

//   //       // Step 2: Fetch assigned menus
//   //       const res = await fetch(
//   //         `${BASE_URL}/menuSchedule/byMonthAndYear?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`,
//   //       );

//   //       if (!res.ok) {
//   //         throw new Error(`HTTP error! status: ${res.status}`);
//   //       }

//   //       const data = await res.json();
//   //       const allSchedules = data.flatMap((week) =>
//   //         ["monday", "tuesday", "wednesday", "thursday", "friday"]
//   //           .map((day) => week[day])
//   //           .filter(Boolean),
//   //       );

//   //       // Step 3: Assign menus to generated weeks
//   //       const updatedWeeks = result.map((week) => {
//   //         const updatedAssignedMenus = { ...week.assignedMenus };

//   //         week.dates.forEach((date) => {
//   //           const formatted = date.toISOString().split("T")[0];
//   //           const schedule = allSchedules.find(
//   //             (entry) => entry?.date === formatted,
//   //           );

//   //           const dayIndex = date.getUTCDay();
//   //           const weekdays = [
//   //             "sunday",
//   //             "monday",
//   //             "tuesday",
//   //             "wednesday",
//   //             "thursday",
//   //             "friday",
//   //             "saturday",
//   //           ];
//   //           const day = weekdays[dayIndex];

//   //           if (
//   //             ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(
//   //               day,
//   //             )
//   //           ) {
//   //             if (schedule) {
//   //               updatedAssignedMenus[day] = {
//   //                 id: schedule.id,
//   //                 menuName: schedule.menuName,
//   //                 menuType: schedule.menuType,
//   //                 isHoliday: schedule.isHoliday || false,
//   //               };
//   //             } else {
//   //               updatedAssignedMenus[day] = null;
//   //             }
//   //           }
//   //         });

//   //         return {
//   //           ...week,
//   //           assignedMenus: updatedAssignedMenus,
//   //         };
//   //       });

//   //       // Step 4: Update UI state
//   //       setWeeks(updatedWeeks);
//   //     } catch (error) {
//   //       console.error("Failed to fetch monthly menu:", error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   generateWeeks();
//   //   fetchMonthlyMenu();
//   // }, [currentDate]);
//   useEffect(() => {
//     const fetchHolidays = async () => {
//       try {
//         const res = await fetch(
//           `${BASE_URL}/holiday/getHolidaysByMonthAndYear?month=${
//             currentDate.getMonth() + 1
//           }&year=${currentDate.getFullYear()}`,
//         );

//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }

//         const data = await res.json();

//         // Store as a Set for quick holiday lookup
//         setHolidays(
//           new Set(
//             data.filter((h) => h.status === "true").map((h) => h.date), // e.g. "2025-08-15"
//           ),
//         );
//       } catch (error) {
//         console.error("Failed to fetch holidays:", error);
//       }
//     };

//     const generateWeeks = () => {
//       const result = [];

//       const firstDayOfMonth = new Date(
//         currentDate.getFullYear(),
//         currentDate.getMonth(),
//         1,
//       );
//       const dayOfWeek = firstDayOfMonth.getDay();

//       const currentMonday = new Date(firstDayOfMonth);
//       currentMonday.setDate(
//         firstDayOfMonth.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1),
//       );

//       for (let i = 0; i < 5; i++) {
//         const weekStart = new Date(currentMonday);
//         weekStart.setDate(currentMonday.getDate() + i * 7);

//         const weekDates = [];
//         for (let d = 0; d < 7; d++) {
//           const date = new Date(weekStart);
//           date.setDate(weekStart.getDate() + d);
//           weekDates.push(date);
//         }

//         const monday = weekDates[0];
//         const friday = weekDates[4];
//         const rangeLabel = `${formatDisplayDate(monday)} - ${formatDisplayDate(
//           friday,
//         )}`;

//         const dayEditability = {
//           monday: isDayEditable(weekDates[0]),
//           tuesday: isDayEditable(weekDates[1]),
//           wednesday: isDayEditable(weekDates[2]),
//           thursday: isDayEditable(weekDates[3]),
//           friday: isDayEditable(weekDates[4]),
//         };

//         result.push({
//           range: rangeLabel,
//           dates: weekDates,
//           assignedMenus: {
//             monday: null,
//             tuesday: null,
//             wednesday: null,
//             thursday: null,
//             friday: null,
//           },
//           isDayEditable: dayEditability,
//         });
//       }

//       setWeeks(result);
//     };

//     const fetchMonthlyMenu = async () => {
//       try {
//         setLoading(true);

//         const result = [];
//         const firstDayOfMonth = new Date(
//           currentDate.getFullYear(),
//           currentDate.getMonth(),
//           1,
//         );
//         const dayOfWeek = firstDayOfMonth.getDay();

//         const currentMonday = new Date(firstDayOfMonth);
//         currentMonday.setDate(
//           firstDayOfMonth.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1),
//         );

//         for (let i = 0; i < 5; i++) {
//           const weekStart = new Date(currentMonday);
//           weekStart.setDate(currentMonday.getDate() + i * 7);

//           const weekDates = [];
//           for (let d = 0; d < 7; d++) {
//             const date = new Date(weekStart);
//             date.setDate(weekStart.getDate() + d);
//             weekDates.push(date);
//           }

//           const monday = weekDates[0];
//           const friday = weekDates[4];
//           const rangeLabel = `${formatDisplayDate(monday)} - ${formatDisplayDate(
//             friday,
//           )}`;

//           const dayEditability = {
//             monday: isDayEditable(weekDates[0]),
//             tuesday: isDayEditable(weekDates[1]),
//             wednesday: isDayEditable(weekDates[2]),
//             thursday: isDayEditable(weekDates[3]),
//             friday: isDayEditable(weekDates[4]),
//           };

//           result.push({
//             range: rangeLabel,
//             dates: weekDates,
//             assignedMenus: {
//               monday: null,
//               tuesday: null,
//               wednesday: null,
//               thursday: null,
//               friday: null,
//             },
//             isDayEditable: dayEditability,
//           });
//         }

//         const res = await fetch(
//           `${BASE_URL}/menuSchedule/byMonthAndYear?month=${
//             currentDate.getMonth() + 1
//           }&year=${currentDate.getFullYear()}`,
//         );

//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }

//         const data = await res.json();
//         const allSchedules = data.flatMap((week) =>
//           ["monday", "tuesday", "wednesday", "thursday", "friday"]
//             .map((day) => week[day])
//             .filter(Boolean),
//         );

//         const updatedWeeks = result.map((week) => {
//           const updatedAssignedMenus = { ...week.assignedMenus };

//           week.dates.forEach((date) => {
//             const formatted = date.toISOString().split("T")[0];
//             const schedule = allSchedules.find(
//               (entry) => entry?.date === formatted,
//             );

//             const dayIndex = date.getUTCDay();
//             const weekdays = [
//               "sunday",
//               "monday",
//               "tuesday",
//               "wednesday",
//               "thursday",
//               "friday",
//               "saturday",
//             ];
//             const day = weekdays[dayIndex];

//             if (
//               ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(
//                 day,
//               )
//             ) {
//               if (schedule) {
//                 updatedAssignedMenus[day] = {
//                   id: schedule.id,
//                   menuName: schedule.menuName,
//                   menuType: schedule.menuType,
//                   isHoliday: holidays.has(formatted), // ✅ Lock if holiday
//                 };
//               } else {
//                 updatedAssignedMenus[day] = {
//                   isHoliday: holidays.has(formatted), // ✅ Lock if holiday
//                 };
//               }
//             }
//           });

//           return {
//             ...week,
//             assignedMenus: updatedAssignedMenus,
//           };
//         });

//         setWeeks(updatedWeeks);
//       } catch (error) {
//         console.error("Failed to fetch monthly menu:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const loadData = async () => {
//       setLoading(true);
//       await fetchHolidays();
//       generateWeeks();
//       await fetchMonthlyMenu();
//       setLoading(false);
//     };

//     loadData();
//   }, [currentDate]);

//   const formatDisplayDate = (date) => {
//     const options = { month: "short", day: "numeric" };
//     return date.toLocaleDateString("en-US", options);
//   };

//   const formatRouteDate = (date) => {
//     return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
//       date.getDate(),
//     ).padStart(2, "0")}`;
//   };

//   // --- NEW isDayEditable FUNCTION (from your provided code) ---
//   // const isDayEditable = (dateToCheck, holidayFlag = false) => {
//   //   if (holidayFlag) return false;
//   //   const today = new Date();
//   //   today.setHours(0, 0, 0, 0); // Normalize today's date to start of day

//   //   const tomorrow = new Date(today);
//   //   tomorrow.setDate(today.getDate() + 1);
//   //   tomorrow.setHours(0, 0, 0, 0); // Normalize tomorrow's date

//   //   const checkedDate = new Date(dateToCheck);
//   //   checkedDate.setHours(0, 0, 0, 0); // Normalize the date being checked

//   //   // Rule 1: Today and past days are not editable
//   //   if (checkedDate <= today) {
//   //     return false;
//   //   }

//   //   // Rule 2: Tomorrow is editable
//   //   if (checkedDate.getTime() === tomorrow.getTime()) {
//   //     return true;
//   //   }

//   //   // Rule 3: Next days or weeks are editable
//   //   if (checkedDate > tomorrow) {
//   //     return true;
//   //   }

//   //   return false;
//   // };
//   const isDayEditable = (dateToCheck, holidayFlag = false) => {
//     // Rule 0: If it's a holiday, it's not editable
//     if (holidayFlag) return false;

//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Normalize to start of today

//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);
//     tomorrow.setHours(0, 0, 0, 0); // Normalize to start of tomorrow

//     const checkedDate = new Date(dateToCheck);
//     checkedDate.setHours(0, 0, 0, 0); // Normalize to start of checked date

//     // Rule 1: Past days and today are not editable
//     if (checkedDate <= today) {
//       return false;
//     }

//     // Rule 2: Tomorrow is editable
//     if (checkedDate.getTime() === tomorrow.getTime()) {
//       return true;
//     }

//     // Rule 3: Any date after tomorrow is editable
//     if (checkedDate > tomorrow) {
//       return true;
//     }

//     return false;
//   };

//   // --- MODIFIED isWeekRangeEditable FUNCTION (for modal trigger) ---
//   const isWeekRangeEditable = (weekDates) => {
//     if (!Array.isArray(weekDates) || weekDates.length === 0) return false;

//     // A week is editable if at least one day in it (Monday to Friday)
//     // is editable according to the new `isDayEditable` logic.
//     // We only care about Monday to Friday for menu assignments.
//     return weekDates.slice(0, 5).some((date) => isDayEditable(date));
//   };

//   const goToPreviousMonth = () => {
//     setCurrentDate(
//       (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
//     );
//   };

//   const goToNextMonth = () => {
//     setCurrentDate(
//       (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
//     );
//   };

//   const getCurrentMonthYear = () => {
//     const options = { month: "long", year: "numeric" };
//     return currentDate.toLocaleDateString("en-US", options);
//   };

//   const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

//   // This list would ideally come from an API or a global state
//   // const [menuTemplates] = useSelector((state) => state.menu.availableTemplates);
//   const menuTemplates = useSelector((state) => state.menu.availableTemplates);

//   console.log(menuTemplates);

//   const handleWeekClick = (week) => {
//     // We now check if the week has *any* editable days to open the modal
//     const editable = isWeekRangeEditable(week.dates);

//     if (editable) {
//       setSelectedWeekData(week);
//       setIsWeekMenuModalOpen(true);
//     } else {
//       // Replaced alert with a console.log, as per instructions to avoid alert()
//       console.log("This week has no editable days for menu assignment.");
//       // You might want to implement a custom message box here instead of console.log
//       // For example: show a temporary notification or a custom modal.
//     }
//   };

//   const handleSaveWeekAssignment = async (weekToUpdate, newAssignments) => {
//     const formatDateLocal = (date) =>
//       `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

//     const startDate = formatDateLocal(weekToUpdate.dates[0]);
//     const endDate = formatDateLocal(weekToUpdate.dates[4]);

//     // ✅ fallback to modal state if not found in weeks state
//     const existingWeek =
//       weeks.find(
//         (w) =>
//           formatDateLocal(w.dates[0]) === startDate &&
//           formatDateLocal(w.dates[4]) === endDate,
//       ) || weekToUpdate;

//     const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

//     const mergedAssignments = {
//       startDate,
//       endDate,
//     };

//     // 🔁 Always loop through all weekdays
//     days.forEach((day) => {
//       const newAssigned = newAssignments?.[day];
//       const existingAssigned = existingWeek?.assignedMenus?.[day];

//       const newId =
//         typeof newAssigned === "object" && newAssigned !== null
//           ? newAssigned.id
//           : typeof newAssigned === "number"
//             ? newAssigned
//             : null;

//       const existingId =
//         typeof existingAssigned === "object" && existingAssigned !== null
//           ? existingAssigned.id
//           : typeof existingAssigned === "number"
//             ? existingAssigned
//             : null;

//       // 🧠 Priority: New → Existing → null
//       if (newId !== null && newId !== undefined) {
//         mergedAssignments[day] = newId;
//       } else if (existingId !== null && existingId !== undefined) {
//         mergedAssignments[day] = existingId;
//       } else {
//         // You can still send null if truly unassigned
//         mergedAssignments[day] = null;
//       }
//     });

//     console.log("📦 Final mergedAssignments payload:", mergedAssignments);

//     try {
//       const response = await fetch(`${BASE_URL}/menuSchedule`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(mergedAssignments),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           `Failed to save menu assignments: ${errorData.message || response.statusText}`,
//         );
//       }

//       const data = await response.json();
//       console.log("Fetched data : ", data);

//       console.log("✅ Menu assignments saved successfully.");

//       setWeeks((prevWeeks) =>
//         prevWeeks.map((week) => {
//           const start = formatDateLocal(week.dates[0]);
//           const end = formatDateLocal(week.dates[4]);

//           if (start === startDate && end === endDate) {
//             // Use backend-provided values directly
//             const updatedMenus = {};
//             days.forEach((day) => {
//               updatedMenus[day] = data[day] ?? null; // keep null exactly as backend sends it
//             });

//             return {
//               ...week,
//               assignedMenus: updatedMenus,
//             };
//           }
//           return week;
//         }),
//       );
//     } catch (error) {
//       console.error("❌ Error saving menu assignments:", error);
//     }

//     setIsWeekMenuModalOpen(false);
//     setSelectedWeekData(null);
//   };

//   return (
//     <Layout>
//       <div className="max-w-5xl mx-auto p-6">
//         {/* Header with Month Navigation */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <div className="w-6 h-6 rounded text-orange-400 flex items-center justify-center">
//               <div>
//                 <CalendarDays />
//               </div>
//             </div>
//             <h1 className="text-3xl font-bold text-gray-800">
//               Menu Assignment Calendar
//             </h1>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               className="p-2 hover:bg-gray-200 rounded"
//               onClick={goToPreviousMonth}
//             >
//               <ChevronLeft className="w-5 h-5" />
//             </button>
//             <span className="px-4 py-1 text-lg font-medium">
//               {getCurrentMonthYear()}
//             </span>
//             <button
//               className="p-2 hover:bg-gray-200 rounded"
//               onClick={goToNextMonth}
//             >
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Calendar Grid */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//           {loading ? (
//             <div className="flex items-center justify-center h-screen">
//               <Loader />
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-6 border-b border-gray-200">
//                 <div className="p-4 font-medium text-gray-700 border-r border-gray-200">
//                   Week
//                 </div>
//                 {dayLabels.map((day) => (
//                   <div
//                     key={day}
//                     className="p-4 font-medium text-gray-700 text-center border-r border-gray-200 last:border-r-0"
//                   >
//                     {day}
//                   </div>
//                 ))}
//               </div>
//               {weeks.map((week, index) => {
//                 const isAnyDayEditableInWeek = isWeekRangeEditable(week.dates); // Use this for overall week lock
//                 return (
//                   <div
//                     key={index}
//                     className={`grid grid-cols-6 border-b border-gray-200 last:border-b-0`}
//                   >
//                     {/* Week Label Column with onClick for WeekMenuModal */}
//                     <div
//                       className={`p-4 border-r border-gray-200 flex flex-col cursor-pointer ${
//                         isAnyDayEditableInWeek
//                           ? "hover:bg-gray-50"
//                           : "opacity-70"
//                       }`}
//                       onClick={() => {
//                         if (isAnyDayEditableInWeek) {
//                           setSelectedWeekData(week);
//                           setIsWeekMenuModalOpen(true);
//                         } else {
//                           console.log(
//                             "This week has no editable days for menu assignment.",
//                           );
//                         }
//                       }}
//                     >
//                       <div className="font-medium text-gray-800 mb-2">
//                         {week.range}
//                       </div>
//                       <div className="flex items-center gap-2">
//                         {isAnyDayEditableInWeek ? (
//                           <>
//                             <Edit3 className="w-4 h-4 text-green-500" />
//                             <span className="text-sm text-green-600 font-medium">
//                               Editable
//                             </span>
//                           </>
//                         ) : (
//                           <>
//                             <Lock className="w-4 h-4 text-gray-400" />
//                             <span className="text-sm text-gray-500 font-medium">
//                               Locked
//                             </span>
//                           </>
//                         )}
//                       </div>
//                     </div>

//                     {/* Day Columns (Mon–Fri) */}
//                     {week.dates.slice(0, 5).map((date, idx) => {
//                       const dayKey = dayLabels[idx]?.toLowerCase(); // e.g., 'monday'
//                       const assignedMenu = week.assignedMenus[dayKey];
//                       const formattedDate = formatRouteDate(date);
//                       const holidayFlag = assignedMenu?.isHoliday || false;
//                       const editableDay = isDayEditable(date, holidayFlag); // Check individual day's editability

//                       return (
//                         <div
//                           key={idx}
//                           className={`relative p-4 border-r border-gray-200 last:border-r-0 text-center hover:bg-gray-50 cursor-pointer ${
//                             !editableDay ? "opacity-70" : ""
//                           }`}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             navigate(`/menu/${role}/${formattedDate}`);
//                           }}
//                         >
//                           {/* Small date in top-right */}
//                           <span className="absolute top-1 right-2 text-xs font-semibold text-gray-800">
//                             {new Date(date).toLocaleDateString("en-GB", {
//                               day: "2-digit",
//                               month: "short",
//                             })}
//                           </span>

//                           <div className="mt-3 flex flex-col items-center gap-2">
//                             <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
//                               <div className="text-gray-400 text-lg">
//                                 <GiHotMeal
//                                   size={25}
//                                   className="text-orange-400"
//                                 />
//                               </div>
//                             </div>

//                             <span className="text-sm text-orange-600 mb-1 font-bold">
//                               {assignedMenu
//                                 ? assignedMenu.menuName
//                                 : "Not assigned"}

//                               {holidayFlag && (
//                                 <span className="text-sm text-red-500 font-semibold">
//                                   Holiday
//                                 </span>
//                               )}
//                             </span>

//                             <div className="flex items-center gap-1">
//                               {editableDay ? (
//                                 <Edit3 className="w-3 h-3 text-green-500" />
//                               ) : (
//                                 <Lock className="w-3 h-3 text-gray-400" />
//                               )}
//                               <span className="text-xs font-semibold text-gray-800">
//                                 {editableDay ? "Editable" : "Locked"}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 );
//               })}
//             </>
//           )}
//         </div>

//         {/* <div className="flex justify-center items-center">
//           <Button className="mt-4 flex gap-2 justify-center items-center">
//             <RefreshCw className="w-4" /> <span>Sync</span>
//           </Button>
//         </div> */}

//         {/* Access Policy */}
//         <div className="bg-orange-200 text-gray-900 p-4 rounded-md mt-6 text-sm">
//           <h2 className="font-semibold mb-1">Access Control Policy</h2>
//           <p>
//             Menu assignments for **today and past days or weeks** are locked and
//             cannot be modified.
//           </p>
//           <p>
//             **Tomorrow** can be editable if it falls on a weekday within the
//             current week.
//           </p>
//           <p>All days in **future weeks** are editable.</p>
//           <p className="mt-2">
//             <span className="text-green-600 font-semibold">
//               Green "Editable"
//             </span>{" "}
//             : Day can be assigned/modified
//           </p>
//           <p>
//             <span className="text-gray-500 font-semibold">Gray "Locked"</span>:
//             Assignment window has closed for this day
//           </p>
//           <p className="mt-2 text-sm font-medium">
//             **Note**: Clicking a week (the leftmost column) will open the
//             assignment modal only if there is at least one editable day within
//             that week.
//           </p>
//         </div>

//         {/* Modals */}
//         {/* Week Menu Assignment Modal */}
//         {isWeekMenuModalOpen && selectedWeekData && (
//           <WeekMenuModal
//             isModalOpen={isWeekMenuModalOpen}
//             setIsModalOpen={setIsWeekMenuModalOpen}
//             weekData={selectedWeekData}
//             menuTemplates={menuTemplates}
//             onSave={handleSaveWeekAssignment}
//           />
//         )}
//       </div>
//     </Layout>
//   );
// }

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
import { Button } from "../../components/ui/Button";
import WeekMenuModal from "../../components/ui/WeekMenuModal";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RefreshCw } from "lucide-react";
import Loader from "../../components/ui/Loader";
import { GiHotMeal } from "react-icons/gi";

export default function AdminWeekViewCalendar() {
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
                          : "opacity-70"
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
                            !editableDay ? "opacity-70" : ""
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
