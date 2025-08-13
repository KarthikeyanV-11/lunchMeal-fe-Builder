// import React, { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { CalendarDays } from "lucide-react";

// const WeekMenuModal = ({
//   isModalOpen,
//   setIsModalOpen,
//   weekData,
//   menuTemplates,
//   onSave,
// }) => {
//   const modalRef = useRef(null);

//   useEffect(() => {
//     function handleOutsideClick(event) {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         setIsModalOpen(false);
//       }
//     }

//     if (isModalOpen) {
//       document.addEventListener("mousedown", handleOutsideClick);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//     };
//   }, [isModalOpen, setIsModalOpen]);

//   if (!isModalOpen || !weekData) return null;

//   const [assignedMenus, setAssignedMenus] = useState(() => {
//     const initialAssignments = {};
//     const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"];
//     daysOfWeek.forEach((day) => {
//       initialAssignments[day] = weekData.assignedMenus[day] || null;
//     });
//     return initialAssignments;
//   });

//   const isDayEditable = (dayKey) => {
//     if (!weekData.isDayEditable) {
//       return true;
//     }
//     return weekData.isDayEditable[dayKey];
//   };

//   // const handleSelectChange = (day, templateId) => {
//   //   if (!isDayEditable(day)) {
//   //     console.warn(`Attempted to change a locked day: ${day}`);
//   //     return;
//   //   }
//   //   // const selectedTemplate = menuTemplates.find(
//   //   //   (t) => Number(t.id) === Number(templateId),
//   //   // );

//   //   const selectedTemplate = menuTemplates.find(
//   //     (t) => t.menuName === templateName,
//   //   );
//   //   console.log(selectedTemplate);

//   //   setAssignedMenus((prev) => ({
//   //     ...prev,
//   //     [day]: selectedTemplate || null,
//   //   }));
//   // };

//   const handleSelectChange = (day, selectedMenuName) => {
//     if (!isDayEditable(day)) {
//       console.warn(`Attempted to change a locked day: ${day}`);
//       return;
//     }

//     const selectedTemplate = menuTemplates.find(
//       (t) => t.menuName === selectedMenuName,
//     );

//     setAssignedMenus((prev) => ({
//       ...prev,
//       [day]: selectedTemplate || null,
//     }));
//   };

//   const handleSave = () => {
//     onSave(weekData, assignedMenus);
//     console.log(weekData);
//     console.log(assignedMenus);
//   };

//   const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
//       <div
//         ref={modalRef}
//         className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-auto"
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             Assign Menu for Week Starting from {weekData.range.split(" - ")[0]}
//           </h2>
//           <button
//             onClick={() => setIsModalOpen(false)}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             &times;
//           </button>
//         </div>

//         <p className="text-sm text-gray-600 mb-6">
//           Select menu templates for each day of the week
//         </p>

//         <div className="grid grid-cols-5 gap-4 mb-8">
//           {dayLabels.map((day) => {
//             const dayKey = day.toLowerCase();
//             const assigned = assignedMenus[dayKey];
//             console.log(assigned);
//             console.log(assignedMenus[dayKey]?.id);
//             const editable = isDayEditable(dayKey);
//             return (
//               <div
//                 key={day}
//                 className={`flex flex-col items-center p-3 border rounded-lg ${
//                   editable
//                     ? "bg-gray-50"
//                     : "bg-gray-200 opacity-70 cursor-not-allowed"
//                 }`}
//               >
//                 <span className="text-sm font-medium text-gray-700 mb-1">
//                   {day}
//                 </span>
//                 <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
//                   {assigned ? assigned.emoji || "🍽" : "🍽"}
//                 </div>
//                 <span className="text-xs text-gray-500 mt-1">
//                   {assigned ? assigned.menuName : "Not assigned"}
//                 </span>
//                 {!editable && (
//                   <span className="text-xs text-red-500 mt-1">Locked</span>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-gray-700">
//             Assign Templates to Days
//           </h3>
//           {dayLabels.map((day) => {
//             const dayKey = day.toLowerCase();
//             const editable = isDayEditable(dayKey);
//             return (
//               <div key={`assign-${day}`} className="flex items-center">
//                 <label
//                   htmlFor={`select-${dayKey}`}
//                   className="w-24 text-gray-700 font-medium"
//                 >
//                   {day}
//                 </label>
//                 {/* <select
//                   id={`select-${dayKey}`}
//                   className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={assignedMenus[dayKey]?.id || ""}
//                   onChange={(e) =>
//                     handleSelectChange(dayKey, parseInt(e.target.value))
//                   }
//                   disabled={!editable}
//                 >
//                   <option value="">No menu assigned</option>
//                   {menuTemplates?.map((template) => (
//                     <option key={template?.id} value={template?.id}>
//                       {template?.menuName}
//                     </option>
//                   ))}
//                 </select> */}
//                 <select
//                   id={`select-${dayKey}`}
//                   className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={assignedMenus[dayKey]?.menuName || ""}
//                   onChange={(e) => handleSelectChange(dayKey, e.target.value)}
//                   disabled={!editable}
//                 >
//                   <option value="">No menu assigned</option>
//                   {menuTemplates?.map((template) => (
//                     <option key={template.menuName} value={template.menuName}>
//                       {template.menuName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             );
//           })}
//         </div>

//         <div className="mt-8 flex justify-end gap-3">
//           <Button
//             variant="outline"
//             onClick={() => setIsModalOpen(false)}
//             className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSave}
//             className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center gap-2"
//           >
//             <CalendarDays className="w-4 h-4" /> Save Week Assignment
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WeekMenuModal;

// import React, { useState, useEffect, useRef } from "react";
// import { Button } from "./Button";
// import { CalendarDays } from "lucide-react";

// const WeekMenuModal = ({
//   isModalOpen,
//   setIsModalOpen,
//   weekData,
//   menuTemplates,
//   onSave,
// }) => {
//   const modalRef = useRef(null);

//   console.log(menuTemplates);
//   console.log(weekData);

//   useEffect(() => {
//     function handleOutsideClick(event) {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         setIsModalOpen(false);
//       }
//     }

//     if (isModalOpen) {
//       document.addEventListener("mousedown", handleOutsideClick);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//     };
//   }, [isModalOpen, setIsModalOpen]);

//   if (!isModalOpen || !weekData) return null;

//   const [assignedMenus, setAssignedMenus] = useState(() => {
//     const initialAssignments = {};
//     const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"];
//     daysOfWeek.forEach((day) => {
//       initialAssignments[day] = weekData.assignedMenus[day] || null;
//     });
//     return initialAssignments;
//   });

//   const isDayEditable = (dayKey) => {
//     if (!weekData.isDayEditable) return true;
//     return weekData.isDayEditable[dayKey];
//   };

//   const handleSelectChange = (day, selectedId) => {
//     if (!isDayEditable(day)) return;

//     const selectedTemplate = menuTemplates.find(
//       (t) => String(t.id) === String(selectedId),
//     );

//     if (!selectedTemplate && selectedId !== "") {
//       console.warn(`❌ Menu with ID ${selectedId} not found.`);
//       return;
//     }

//     setAssignedMenus((prev) => ({
//       ...prev,
//       [day]: selectedTemplate || null,
//     }));
//   };

//   const handleSave = () => {
//     console.log("🧾 Assigned Menus before save:", assignedMenus);
//     onSave(weekData, assignedMenus);
//     console.log(weekData);
//     console.log(assignedMenus);
//   };

//   const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
//       <div
//         ref={modalRef}
//         className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-auto"
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             Assign Menu for Week Starting from {weekData.range.split(" - ")[0]}
//           </h2>
//           <button
//             onClick={() => setIsModalOpen(false)}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             &times;
//           </button>
//         </div>

//         <p className="text-sm text-gray-600 mb-6">
//           Select menu templates for each day of the week
//         </p>

//         <div className="grid grid-cols-5 gap-4 mb-8">
//           {dayLabels.map((day) => {
//             const dayKey = day.toLowerCase();
//             const assigned = assignedMenus[dayKey];
//             const editable = isDayEditable(dayKey);
//             return (
//               <div
//                 key={day}
//                 className={`flex flex-col items-center p-3 border rounded-lg ${
//                   editable
//                     ? "bg-gray-50"
//                     : "bg-gray-200 opacity-70 cursor-not-allowed"
//                 }`}
//               >
//                 <span className="text-sm font-medium text-gray-700 mb-1">
//                   {day}
//                 </span>
//                 <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
//                   {assigned ? assigned.emoji || "🍽" : "🍽"}
//                 </div>
//                 <span className="text-xs text-gray-500 mt-1">
//                   {assigned ? assigned.menuName : "Not assigned"}
//                 </span>
//                 {!editable && (
//                   <span className="text-xs text-red-500 mt-1">Locked</span>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-gray-700">
//             Assign Templates to Days
//           </h3>
//           {dayLabels.map((day) => {
//             const dayKey = day.toLowerCase();
//             const editable = isDayEditable(dayKey);
//             return (
//               <div key={`assign-${day}`} className="flex items-center">
//                 <label
//                   htmlFor={`select-${dayKey}`}
//                   className="w-24 text-gray-700 font-medium"
//                 >
//                   {day}
//                 </label>
//                 <select
//                   id={`select-${dayKey}`}
//                   className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={assignedMenus[dayKey]?.id || ""}
//                   onChange={(e) => handleSelectChange(dayKey, e.target.value)}
//                   disabled={!editable}
//                 >
//                   <option value="">No menu assigned</option>
//                   {menuTemplates.map((template) => (
//                     <option key={template.id} value={template.id}>
//                       {template.menuName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             );
//           })}
//         </div>

//         <div className="mt-8 flex justify-end gap-3">
//           <Button
//             variant="outline"
//             onClick={() => setIsModalOpen(false)}
//             className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSave}
//             className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center gap-2"
//           >
//             <CalendarDays className="w-4 h-4" /> Save Week Assignment
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WeekMenuModal;

// import React, { useState, useEffect, useRef } from "react";
// import { Button } from "./Button";
// import { CalendarDays } from "lucide-react";

// const WeekMenuModal = ({
//   isModalOpen,
//   setIsModalOpen,
//   weekData,
//   menuTemplates,
//   onSave,
// }) => {
//   const modalRef = useRef(null);

//   useEffect(() => {
//     function handleOutsideClick(event) {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         setIsModalOpen(false);
//       }
//     }

//     if (isModalOpen) {
//       document.addEventListener("mousedown", handleOutsideClick);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//     };
//   }, [isModalOpen, setIsModalOpen]);

//   if (!isModalOpen || !weekData) return null;

//   const [assignedMenus, setAssignedMenus] = useState(() => {
//     const initialAssignments = {};
//     const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"];
//     daysOfWeek.forEach((day) => {
//       initialAssignments[day] = weekData.assignedMenus[day] || null;
//     });
//     return initialAssignments;
//   });

//   const isDayEditable = (dayKey) => {
//     if (!weekData.isDayEditable) return true;
//     return weekData.isDayEditable[dayKey];
//   };

//   const isHoliday = (dayKey) => {
//     if (!weekData.isHoliday) return false;
//     return weekData.isHoliday[dayKey];
//   };

//   const handleSelectChange = (day, selectedId) => {
//     if (!isDayEditable(day) || isHoliday(day)) return;

//     const selectedTemplate = menuTemplates.find(
//       (t) => String(t.id) === String(selectedId),
//     );

//     if (!selectedTemplate && selectedId !== "") {
//       console.warn(`❌ Menu with ID ${selectedId} not found.`);
//       return;
//     }

//     setAssignedMenus((prev) => ({
//       ...prev,
//       [day]: selectedTemplate || null,
//     }));
//   };

//   const handleSave = () => {
//     onSave(weekData, assignedMenus);
//   };

//   const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
//       <div
//         ref={modalRef}
//         className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-auto"
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             Assign Menu for Week Starting from {weekData.range.split(" - ")[0]}
//           </h2>
//           <button
//             onClick={() => setIsModalOpen(false)}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             &times;
//           </button>
//         </div>

//         <p className="text-sm text-gray-600 mb-6">
//           Select menu templates for each day of the week
//         </p>

//         {/* Day overview grid */}
//         <div className="grid grid-cols-5 gap-4 mb-8">
//           {dayLabels.map((day) => {
//             const dayKey = day.toLowerCase();
//             const assigned = assignedMenus[dayKey];
//             const editable = isDayEditable(dayKey);
//             const holiday = isHoliday(dayKey);
//             return (
//               <div
//                 key={day}
//                 className={`flex flex-col items-center p-3 border rounded-lg ${
//                   editable && !holiday
//                     ? "bg-gray-50"
//                     : "bg-gray-200 opacity-70 cursor-not-allowed"
//                 }`}
//               >
//                 <span className="text-sm font-medium text-gray-700 mb-1">
//                   {day}
//                 </span>
//                 <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
//                   {holiday ? "🏖" : assigned ? assigned.emoji || "🍽" : "🍽"}
//                 </div>
//                 <span className="text-xs text-gray-500 mt-1">
//                   {holiday
//                     ? "Holiday"
//                     : assigned
//                       ? assigned.menuName
//                       : "Not assigned"}
//                 </span>
//                 {holiday && (
//                   <span className="text-xs text-red-500 mt-1">Holiday</span>
//                 )}
//                 {!holiday && !editable && (
//                   <span className="text-xs text-red-500 mt-1">Locked</span>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {/* Dropdown assignments */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-gray-700">
//             Assign Templates to Days
//           </h3>
//           {dayLabels.map((day) => {
//             const dayKey = day.toLowerCase();
//             const editable = isDayEditable(dayKey);
//             const holiday = isHoliday(dayKey);
//             return (
//               <div key={`assign-${day}`} className="flex items-center">
//                 <label
//                   htmlFor={`select-${dayKey}`}
//                   className="w-24 text-gray-700 font-medium"
//                 >
//                   {day}
//                 </label>
//                 <select
//                   id={`select-${dayKey}`}
//                   className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={holiday ? "" : assignedMenus[dayKey]?.id || ""}
//                   onChange={(e) => handleSelectChange(dayKey, e.target.value)}
//                   disabled={!editable || holiday}
//                 >
//                   {holiday ? (
//                     <option value="">Holiday</option>
//                   ) : (
//                     <>
//                       <option value="">No menu assigned</option>
//                       {menuTemplates.map((template) => (
//                         <option key={template.id} value={template.id}>
//                           {template.menuName}
//                         </option>
//                       ))}
//                     </>
//                   )}
//                 </select>
//               </div>
//             );
//           })}
//         </div>

//         {/* Footer buttons */}
//         <div className="mt-8 flex justify-end gap-3">
//           <Button
//             variant="outline"
//             onClick={() => setIsModalOpen(false)}
//             className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSave}
//             className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center gap-2"
//           >
//             <CalendarDays className="w-4 h-4" /> Save Week Assignment
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WeekMenuModal;

// import React, { useState, useEffect, useRef } from "react";
// import { Button } from "./Button";
// import { CalendarDays } from "lucide-react";
// import { GiHotMeal } from "react-icons/gi";
// import { IoMdHappy } from "react-icons/io";

// const WeekMenuModal = ({
//   isModalOpen,
//   setIsModalOpen,
//   weekData,
//   menuTemplates,
//   onSave,
// }) => {
//   const modalRef = useRef(null);

//   useEffect(() => {
//     function handleOutsideClick(event) {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         setIsModalOpen(false);
//       }
//     }
//     if (isModalOpen) {
//       document.addEventListener("mousedown", handleOutsideClick);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//     };
//   }, [isModalOpen, setIsModalOpen]);

//   if (!isModalOpen || !weekData) return null;

//   const [assignedMenus, setAssignedMenus] = useState(() => {
//     const initialAssignments = {};
//     const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"];
//     daysOfWeek.forEach((day) => {
//       initialAssignments[day] = weekData.assignedMenus[day] || null;
//     });
//     return initialAssignments;
//   });

//   // Keep state in sync when weekData changes
//   useEffect(() => {
//     if (weekData) {
//       const daysOfWeek = [
//         "monday",
//         "tuesday",
//         "wednesday",
//         "thursday",
//         "friday",
//       ];
//       const updatedAssignments = {};
//       daysOfWeek.forEach((day) => {
//         updatedAssignments[day] = weekData.assignedMenus[day] || null;
//       });
//       setAssignedMenus(updatedAssignments);
//     }
//   }, [weekData]);

//   const isDayEditable = (dayKey) => {
//     if (!weekData.isDayEditable) return true;
//     return weekData.isDayEditable[dayKey];
//   };

//   // Correct holiday detection from assignedMenus
//   const isHoliday = (dayKey) => {
//     return weekData.assignedMenus?.[dayKey]?.isHoliday || false;
//   };

//   const handleSelectChange = (day, selectedId) => {
//     if (!isDayEditable(day) || isHoliday(day)) return;
//     const selectedTemplate = menuTemplates.find(
//       (t) => String(t.id) === String(selectedId),
//     );
//     if (!selectedTemplate && selectedId !== "") {
//       console.warn(`❌ Menu with ID ${selectedId} not found.`);
//       return;
//     }
//     setAssignedMenus((prev) => ({
//       ...prev,
//       [day]: selectedTemplate || null,
//     }));
//   };

//   const handleSave = () => {
//     onSave(weekData, assignedMenus);
//   };

//   const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
//       <div
//         ref={modalRef}
//         className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-auto"
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             Assign Menu for Week Starting from {weekData.range.split(" - ")[0]}
//           </h2>
//           <button
//             onClick={() => setIsModalOpen(false)}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             &times;
//           </button>
//         </div>

//         <p className="text-sm text-gray-600 mb-6">
//           Select menu templates for each day of the week
//         </p>

//         {/* Day overview grid */}
//         <div className="grid grid-cols-5 gap-4 mb-8">
//           {dayLabels.map((day) => {
//             const dayKey = day.toLowerCase();
//             const assigned = assignedMenus[dayKey];
//             const editable = isDayEditable(dayKey);
//             const holiday = isHoliday(dayKey);
//             return (
//               <div
//                 key={day}
//                 className={`flex flex-col items-center p-3 border rounded-lg ${
//                   editable && !holiday
//                     ? "bg-gray-50"
//                     : "bg-gray-200 opacity-70 cursor-not-allowed"
//                 }`}
//               >
//                 <span className="text-sm font-medium text-gray-700 mb-1">
//                   {day}
//                 </span>
//                 <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
//                   {holiday ? (
//                     <IoMdHappy className="text-orange-400" />
//                   ) : assigned ? (
//                     assigned.emoji || <GiHotMeal className="text-orange-400" />
//                   ) : (
//                     <GiHotMeal className="text-orange-400" />
//                   )}
//                 </div>
//                 <span className="text-xs text-gray-500 mt-1">
//                   {holiday
//                     ? "Holiday"
//                     : assigned
//                       ? assigned.menuName
//                       : "Not assigned"}
//                 </span>
//                 {holiday && (
//                   <span className="text-sm text-red-500 mt-1">Holiday</span>
//                 )}
//                 {!holiday && !editable && (
//                   <span className="text-sm text-red-500 mt-1">Locked</span>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {/* Dropdown assignments */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-gray-700">
//             Assign Templates to Days
//           </h3>
//           {dayLabels.map((day) => {
//             const dayKey = day.toLowerCase();
//             const editable = isDayEditable(dayKey);
//             const holiday = isHoliday(dayKey);
//             return (
//               <div key={`assign-${day}`} className="flex items-center">
//                 <label
//                   htmlFor={`select-${dayKey}`}
//                   className="w-24 text-gray-700 font-medium"
//                 >
//                   {day}
//                 </label>
//                 <select
//                   id={`select-${dayKey}`}
//                   className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={holiday ? "" : assignedMenus[dayKey]?.id || ""}
//                   onChange={(e) => handleSelectChange(dayKey, e.target.value)}
//                   disabled={!editable || holiday}
//                 >
//                   {holiday ? (
//                     <option value="">Holiday</option>
//                   ) : (
//                     <>
//                       <option value="">No menu assigned</option>
//                       {menuTemplates.map((template) => (
//                         <option key={template.id} value={template.id}>
//                           {template.menuName}
//                         </option>
//                       ))}
//                     </>
//                   )}
//                 </select>
//               </div>
//             );
//           })}
//         </div>

//         {/* Footer buttons */}
//         <div className="mt-8 flex justify-end gap-3">
//           <Button
//             variant="outline"
//             onClick={() => setIsModalOpen(false)}
//             className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSave}
//             className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center gap-2"
//           >
//             <CalendarDays className="w-4 h-4" /> Save Week Assignment
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WeekMenuModal;

import React, { useState, useEffect, useRef } from "react";
import { Button } from "./Button";
import { CalendarDays } from "lucide-react";
import { GiHotMeal } from "react-icons/gi";
import { IoMdHappy } from "react-icons/io";

const WeekMenuModal = ({
  isModalOpen,
  setIsModalOpen,
  weekData,
  menuTemplates,
  onSave,
  holidays, // <-- NEW: Pass holidays Set from calendar
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    }
    if (isModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModalOpen, setIsModalOpen]);

  if (!isModalOpen || !weekData) return null;

  const [assignedMenus, setAssignedMenus] = useState(() => {
    const initialAssignments = {};
    const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    daysOfWeek.forEach((day) => {
      initialAssignments[day] = weekData.assignedMenus[day] || null;
    });
    return initialAssignments;
  });

  // Sync if weekData changes
  useEffect(() => {
    if (weekData) {
      const daysOfWeek = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
      ];
      const updatedAssignments = {};
      daysOfWeek.forEach((day) => {
        updatedAssignments[day] = weekData.assignedMenus[day] || null;
      });
      setAssignedMenus(updatedAssignments);
    }
  }, [weekData]);

  const formatRouteDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const isDayEditable = (dayKey) => {
    if (!weekData.isDayEditable) return true;
    return weekData.isDayEditable[dayKey];
  };

  // Holiday detection now uses holidays Set
  const isHoliday = (dayKey) => {
    const dateObj =
      weekData.dates[
        ["monday", "tuesday", "wednesday", "thursday", "friday"].indexOf(dayKey)
      ];
    const formattedDate = formatRouteDate(dateObj);
    return holidays?.has(formattedDate) || false;
  };

  const handleSelectChange = (day, selectedId) => {
    if (!isDayEditable(day) || isHoliday(day)) return;

    const selectedTemplate = menuTemplates.find(
      (t) => String(t.id) === String(selectedId),
    );

    if (!selectedTemplate && selectedId !== "") {
      console.warn(`❌ Menu with ID ${selectedId} not found.`);
      return;
    }

    setAssignedMenus((prev) => ({
      ...prev,
      [day]: selectedTemplate || null,
    }));
  };

  const handleSave = () => {
    onSave(weekData, assignedMenus);
  };

  const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Assign Menu for Week Starting from {weekData.range.split(" - ")[0]}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Select menu templates for each day. Holidays are locked.
        </p>

        {/* Day Overview */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {dayLabels.map((day) => {
            const dayKey = day.toLowerCase();
            const assigned = assignedMenus[dayKey];
            const editable = isDayEditable(dayKey);
            const holiday = isHoliday(dayKey);

            return (
              <div
                key={day}
                className={`flex flex-col items-center p-3 border rounded-lg ${
                  editable && !holiday
                    ? "bg-gray-50"
                    : "bg-gray-200 opacity-70 cursor-not-allowed"
                }`}
              >
                <span className="text-sm font-medium text-gray-700 mb-1">
                  {day}
                </span>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                  {holiday ? (
                    <IoMdHappy className="text-orange-400" />
                  ) : assigned ? (
                    assigned.emoji || <GiHotMeal className="text-orange-400" />
                  ) : (
                    <GiHotMeal className="text-orange-400" />
                  )}
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {holiday
                    ? "Holiday"
                    : assigned
                      ? assigned.menuName
                      : "Not assigned"}
                </span>
                {holiday && (
                  <span className="text-sm text-red-500 mt-1">Holiday</span>
                )}
                {!holiday && !editable && (
                  <span className="text-sm text-red-500 mt-1">Locked</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Assign Templates */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Assign Templates to Days
          </h3>
          {dayLabels.map((day) => {
            const dayKey = day.toLowerCase();
            const editable = isDayEditable(dayKey);
            const holiday = isHoliday(dayKey);

            return (
              <div key={`assign-${day}`} className="flex items-center">
                <label
                  htmlFor={`select-${dayKey}`}
                  className="w-24 text-gray-700 font-medium"
                >
                  {day}
                </label>
                <select
                  id={`select-${dayKey}`}
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={holiday ? "" : assignedMenus[dayKey]?.id || ""}
                  onChange={(e) => handleSelectChange(dayKey, e.target.value)}
                  disabled={!editable || holiday}
                >
                  {holiday ? (
                    <option value="">Holiday</option>
                  ) : (
                    <>
                      <option value="">No menu assigned</option>
                      {menuTemplates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.menuName}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center gap-2"
          >
            <CalendarDays className="w-4 h-4" /> Save Week Assignment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WeekMenuModal;
