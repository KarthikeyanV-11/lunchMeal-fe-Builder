// import { useState, useEffect } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Lock,
//   Edit3,
//   CalendarDays,
// } from "lucide-react";
// import { Layout } from "@/components/shared/Layout"; // ✅ Using your real layout
// import { useAuth } from "@/contexts/AuthContext"; // ✅ Use actual auth context
// import { Button } from "@/components/ui/button";
// import Modal from "../../components/ui/Modal";
// import { useNavigate } from "react-router-dom";

// export default function AdminWeekViewCalendar() {
//   const [weeks, setWeeks] = useState([]);
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedWeekData, setSelectedWeekData] = useState(null);

//   const navigate = useNavigate();

//   const { role } = useAuth();

//   useEffect(() => {
//     const generateWeeks = () => {
//       const result = [];

//       const firstDayOfMonth = new Date(
//         currentDate.getFullYear(),
//         currentDate.getMonth(),
//         1,
//       );
//       const currentSunday = new Date(firstDayOfMonth);
//       currentSunday.setDate(
//         firstDayOfMonth.getDate() - firstDayOfMonth.getDay(),
//       );

//       for (let i = 0; i < 5; i++) {
//         const weekStart = new Date(currentSunday);
//         weekStart.setDate(currentSunday.getDate() + i * 7);

//         const weekDates = [];
//         for (let d = 0; d < 7; d++) {
//           const date = new Date(weekStart);
//           date.setDate(weekStart.getDate() + d);
//           weekDates.push(date);
//         }

//         const monday = weekDates[1];
//         const friday = weekDates[5];
//         const rangeLabel = `${formatDisplayDate(monday)} - ${formatDisplayDate(friday)}`;

//         result.push({
//           range: rangeLabel,
//           dates: weekDates,
//           assignedMenus: {
//             // Initializing assignedMenus
//             monday: null,
//             tuesday: null,
//             wednesday: null,
//             thursday: null,
//             friday: null,
//           },
//         });
//       }

//       setWeeks(result);
//     };

//     generateWeeks();
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

//   const isWeekEditable = (mondayDate) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Normalize today to start of day

//     const sundayBefore = new Date(mondayDate);
//     sundayBefore.setDate(mondayDate.getDate() - 1);
//     sundayBefore.setHours(23, 59, 59, 999); // Normalize Sunday to end of day

//     return today < sundayBefore;
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

//   const menuTemplates = [
//     { id: 1, name: "Veg Menu", emoji: "🥗" },
//     { id: 2, name: "Non-Veg Menu", emoji: "🍗" },
//     { id: 3, name: "South Indian", emoji: "🍛" },
//     { id: 4, name: "North Indian", emoji: "🍲" },
//   ];

//   return (
//     <Layout>
//       <div className="max-w-5xl mx-auto p-6">
//         {/* Header with Month Navigation */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <div className="w-6 h-6  rounded flex items-center justify-center">
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
//           <div className="grid grid-cols-6 border-b border-gray-200">
//             <div className="p-4 font-medium text-gray-700 border-r border-gray-200">
//               Week
//             </div>
//             {dayLabels.map((day) => (
//               <div
//                 key={day}
//                 className="p-4 font-medium text-gray-700 text-center border-r border-gray-200 last:border-r-0"
//               >
//                 {day}
//               </div>
//             ))}
//           </div>
//           {weeks.map((week, index) => {
//             const monday = week.dates[1];
//             const editable = isWeekEditable(monday);

//             return (
//               <div
//                 key={index}
//                 className="grid grid-cols-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer"
//                 onClick={() => {
//                   const formatted = formatRouteDate(monday);
//                   navigate(`/menu/${role}/${formatted}`); // Corrected line
//                 }}
//               >
//                 <div className="p-4 border-r border-gray-200 flex flex-col">
//                   <div className="font-medium text-gray-800 mb-2">
//                     {week.range}
//                   </div>
//                   <div className="flex items-center gap-2">
//                     {editable ? (
//                       <>
//                         <Edit3 className="w-4 h-4 text-blue-500" />
//                         <span className="text-sm text-blue-600 font-medium">
//                           Editable
//                         </span>
//                       </>
//                     ) : (
//                       <>
//                         <Lock className="w-4 h-4 text-gray-400" />
//                         <span className="text-sm text-gray-500 font-medium">
//                           Locked
//                         </span>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {week.dates.slice(1, 6).map((date, idx) => (
//                   <div
//                     key={idx}
//                     className="p-4 border-r border-gray-200 last:border-r-0 text-center"
//                   >
//                     <div className="flex flex-col items-center gap-2">
//                       <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
//                         <div className="text-gray-400 text-lg">🍽</div>
//                       </div>
//                       <span className="text-sm text-gray-500">
//                         Not assigned
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             );
//           })}
//         </div>

//         {/* Access Policy */}
//         <div className="bg-orange-200 text-gray-900 p-4 rounded-md mt-6 text-sm">
//           <h2 className="font-semibold mb-1">Access Control Policy</h2>
//           <p>
//             Menu assignments for each week must be made before the Sunday
//             preceding that week.
//           </p>
//           <p>
//             Once a week starts (Monday), the menu becomes locked and cannot be
//             modified.
//           </p>
//           <p className="mt-2">
//             <span className="text-green-600 font-semibold">
//               Green "Editable"
//             </span>
//             : Week can still be assigned/modified
//           </p>
//           <p>
//             <span className="text-gray-500 font-semibold">Gray "Locked"</span>:
//             Assignment window has closed
//           </p>
//         </div>

//         {/* Menu Templates */}
//         <div className="mt-10 border rounded-xl p-4 shadow-sm hover:shadow-md transition">
//           <div className="flex justify-between">
//             <h2 className="text-xl font-semibold mb-4">
//               🍚 Available Menu Templates
//             </h2>
//             <Button size="sm" onClick={() => setIsModalOpen(true)}>
//               + New Template
//             </Button>
//           </div>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//             {menuTemplates.map((template) => (
//               <div
//                 key={template.id}
//                 onClick={() => navigate(`/menu`)}
//                 className="cursor-pointer border rounded-xl p-4 shadow-sm hover:shadow-md transition"
//               >
//                 <div className="text-3xl">{template.emoji}</div>
//                 <div className="mt-2 font-medium">{template.name}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//         {/*modal window*/}
//         {isModalOpen && (
//           <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
//         )}
//       </div>
//     </Layout>
//   );
// }

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Edit3,
  CalendarDays,
} from "lucide-react";
import { Layout } from "@/components/shared/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import WeekMenuModal from "../../components/ui/WeekMenuModal"; // Corrected import path/name
import CreateTemplateModal from "../../components/ui/CreateTemplateModal"; // Renamed and imported the 'Modal' component for creating templates
import { useNavigate } from "react-router-dom";

export default function AdminWeekViewCalendar() {
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

  const { role } = useAuth();

  useEffect(() => {
    const generateWeeks = () => {
      const result = [];

      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const currentSunday = new Date(firstDayOfMonth);
      currentSunday.setDate(
        firstDayOfMonth.getDate() - firstDayOfMonth.getDay(),
      );

      for (let i = 0; i < 5; i++) {
        const weekStart = new Date(currentSunday);
        weekStart.setDate(currentSunday.getDate() + i * 7);

        const weekDates = [];
        for (let d = 0; d < 7; d++) {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + d);
          weekDates.push(date);
        }

        const monday = weekDates[1];
        const friday = weekDates[5];
        const rangeLabel = `${formatDisplayDate(monday)} - ${formatDisplayDate(friday)}`;

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
        });
      }

      setWeeks(result);
    };

    generateWeeks();
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

  const isWeekEditable = (mondayDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day

    const sundayBefore = new Date(mondayDate);
    sundayBefore.setDate(mondayDate.getDate() - 1); // Get the Sunday before Monday
    sundayBefore.setHours(23, 59, 59, 999); // Normalize Sunday to end of day

    return today < sundayBefore;
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
  const menuTemplates = [
    { id: 1, name: "Veg Menu", emoji: "🥗" },
    { id: 2, name: "Non-Veg Menu", emoji: "🍗" },
    { id: 3, name: "South Indian", emoji: "🍛" },
    { id: 4, name: "North Indian", emoji: "🍲" },
  ];

  const handleWeekClick = (week) => {
    const monday = week.dates[1];
    const editable = isWeekEditable(monday);

    if (editable) {
      setSelectedWeekData(week); // Set the entire week object
      setIsWeekMenuModalOpen(true); // Open the correct modal
    } else {
      alert("This week's menu is locked and cannot be modified.");
    }
  };

  // Function to handle saving assignments from the WeekMenuModal (to be passed to modal)
  const handleSaveWeekAssignment = (weekToUpdate, assignments) => {
    console.log(
      "Saving assignments for week:",
      weekToUpdate.range,
      assignments,
    );

    setWeeks((prevWeeks) =>
      prevWeeks.map((week) =>
        week.range === weekToUpdate.range
          ? { ...week, assignedMenus: assignments }
          : week,
      ),
    );

    setIsWeekMenuModalOpen(false); // Close the correct modal after saving
    setSelectedWeekData(null); // Clear selected data
  };

  // Function to handle creating a new template (placeholder for now)
  const handleCreateNewTemplate = (templateData) => {
    console.log("Creating new template:", templateData);
    // Here you would typically send templateData to your backend API
    // Then, you might update your local menuTemplates state or refetch them
    // For now, let's just close the modal
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
            const monday = week.dates[1];
            const editable = isWeekEditable(monday);

            return (
              <div
                key={index}
                className={`grid grid-cols-6 border-b border-gray-200 last:border-b-0 ${editable ? "hover:bg-gray-50 cursor-pointer" : "opacity-70"}`}
                onClick={() => handleWeekClick(week)} // Use the new handler
              >
                <div className="p-4 border-r border-gray-200 flex flex-col">
                  <div className="font-medium text-gray-800 mb-2">
                    {week.range}
                  </div>
                  <div className="flex items-center gap-2">
                    {editable ? (
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

                {week.dates.slice(1, 6).map((date, idx) => {
                  const dayKey = dayLabels[idx]?.toLowerCase(); // e.g., 'monday'
                  const assignedMenu = week.assignedMenus[dayKey];
                  return (
                    <div
                      key={idx}
                      className="p-4 border-r border-gray-200 last:border-r-0 text-center"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <div className="text-gray-400 text-lg">🍽</div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {assignedMenu ? assignedMenu.name : "Not assigned"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Access Policy */}
        <div className="bg-orange-200 text-gray-900 p-4 rounded-md mt-6 text-sm">
          <h2 className="font-semibold mb-1">Access Control Policy</h2>
          <p>
            Menu assignments for each week must be made before the Sunday
            preceding that week.
          </p>
          <p>
            Once a week starts (Monday), the menu becomes locked and cannot be
            modified.
          </p>
          <p className="mt-2">
            <span className="text-green-600 font-semibold">
              Green "Editable"
            </span>{" "}
            : Week can still be assigned/modified
          </p>
          <p>
            <span className="text-gray-500 font-semibold">Gray "Locked"</span>:
            Assignment window has closed
          </p>
        </div>

        {/* Menu Templates Section */}
        <div className="mt-10 border rounded-xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-4">
              🍚 Available Menu Templates
            </h2>
            <Button
              size="sm"
              onClick={() => setIsCreateTemplateModalOpen(true)}
            >
              + New Template
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {menuTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => navigate(`/menu/${template.id}`)} // Example: navigate to a template detail page
                className="cursor-pointer border rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="text-3xl">{template.emoji}</div>
                <div className="mt-2 font-medium">{template.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Modals */}
        {/* Week Menu Assignment Modal */}
        {isWeekMenuModalOpen && selectedWeekData && (
          <WeekMenuModal
            isModalOpen={isWeekMenuModalOpen} // Use the correct state variable
            setIsModalOpen={setIsWeekMenuModalOpen} // Use the correct setter
            weekData={selectedWeekData}
            menuTemplates={menuTemplates}
            onSave={handleSaveWeekAssignment}
          />
        )}

        {/* Create New Template Modal */}
        {isCreateTemplateModalOpen && (
          <CreateTemplateModal
            isOpen={isCreateTemplateModalOpen} // Pass the state to the modal
            setIsOpen={setIsCreateTemplateModalOpen} // Pass the setter to the modal
            onSaveTemplate={handleCreateNewTemplate} // Pass a handler for saving new templates
          />
        )}
      </div>
    </Layout>
  );
}
