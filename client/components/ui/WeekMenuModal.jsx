// src/components/ui/WeekMenuModal.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Assuming your Button component is here
import { CalendarDays } from "lucide-react"; // Import icon

const WeekMenuModal = ({
  isModalOpen,
  setIsModalOpen,
  weekData,
  menuTemplates,
  onSave,
}) => {
  console.log(menuTemplates);
  if (!isModalOpen || !weekData) return null;

  const [assignedMenus, setAssignedMenus] = useState(() => {
    const initialAssignments = {};
    const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    daysOfWeek.forEach((day) => {
      // Ensure we're initializing with existing assignments if available
      initialAssignments[day] = weekData.assignedMenus[day] || null;
    });
    return initialAssignments;
  });

  /**
   * Checks if a specific day is editable based on the weekData.
   * If weekData.isDayEditable is not provided, all days are considered editable by default.
   * @param {string} dayKey - The lowercase string representation of the day (e.g., "monday").
   * @returns {boolean} True if the day is editable, false otherwise.
   */
  const isDayEditable = (dayKey) => {
    // If weekData.isDayEditable is not explicitly provided, assume all days are editable.
    if (!weekData.isDayEditable) {
      return true;
    }
    // Otherwise, return the specific editable status for the day.
    return weekData.isDayEditable[dayKey];
  };

  /**
   * Handles the change event for the day assignment select dropdown.
   * Only allows changes if the day is editable.
   * @param {string} day - The lowercase string representation of the day.
   * @param {string} templateId - The ID of the selected menu template.
   */
  const handleSelectChange = (day, templateId) => {
    // Prevent changes if the day is not editable.
    if (!isDayEditable(day)) {
      console.warn(`Attempted to change a locked day: ${day}`);
      return;
    }
    const selectedTemplate = menuTemplates.find(
      (t) => Number(t.id) === Number(templateId),
    );

    setAssignedMenus((prev) => ({
      ...prev,
      [day]: selectedTemplate || null,
    }));
  };

  /**
   * Handles the save action, passing the current week data and assigned menus
   * to the parent component's onSave callback.
   */
  const handleSave = () => {
    onSave(weekData, assignedMenus); // <-- fixed: using the actual state variable
  };

  const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Assign Menu for Week Starting {weekData.range.split(" - ")[0]}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Select menu templates for each day of the week
        </p>

        {/* Top row showing selected menus/placeholders for each day */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {dayLabels.map((day, index) => {
            const dayKey = day.toLowerCase();
            const assigned = assignedMenus[dayKey];
            const editable = isDayEditable(dayKey); // Determine if the day is editable
            return (
              <div
                key={day}
                // Apply different background and cursor for locked days
                className={`flex flex-col items-center p-3 border rounded-lg ${editable ? "bg-gray-50" : "bg-gray-200 opacity-70 cursor-not-allowed"}`}
              >
                <span className="text-sm font-medium text-gray-700 mb-1">
                  {day}
                </span>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                  {assigned ? assigned.emoji || "🍽" : "🍽"}
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {assigned ? assigned.menuName : "Not assigned"}
                </span>

                {!editable && ( // Display "Locked" text if the day is not editable
                  <span className="text-xs text-red-500 mt-1">Locked</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Assign Templates to Days section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Assign Templates to Days
          </h3>
          {dayLabels.map((day, index) => {
            const dayKey = day.toLowerCase();
            const editable = isDayEditable(dayKey); // Determine if the day is editable
            return (
              <div key={`assign-${day}`} className="flex items-center">
                <label
                  htmlFor={`select-${dayKey}`}
                  className="w-24 text-gray-700 font-medium"
                >
                  {day}
                </label>
                <select
                  id={`select-${dayKey}`} // ✅ Fix here
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={assignedMenus[dayKey]?.id || ""}
                  onChange={(e) =>
                    handleSelectChange(dayKey, parseInt(e.target.value))
                  }
                  disabled={!editable}
                >
                  <option value="">No menu assigned</option>
                  {menuTemplates?.map((template) => (
                    <option key={template?.id} value={template?.id}>
                      {template?.menuName}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
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
