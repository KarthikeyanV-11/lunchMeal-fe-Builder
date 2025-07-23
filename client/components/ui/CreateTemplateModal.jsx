// src/components/ui/Modal.jsx (Consider renaming this file to CreateTemplateModal.jsx)
import React, { useState } from "react"; // Import useState for local form state
import { Button } from "@/components/ui/button";

function CreateTemplateModal({ isOpen, setIsOpen, onSaveTemplate }) {
  // Local state for the form fields
  const [templateName, setTemplateName] = useState("");
  const [menuType, setMenuType] = useState("");
  const [description, setDescription] = useState("");
  const [menuItems, setMenuItems] = useState("");

  if (!isOpen) return null; // Use the correct prop name here

  const handleSubmit = () => {
    // Basic validation
    if (!templateName || !menuType || !description || !menuItems) {
      alert("Please fill in all fields.");
      return;
    }

    const newTemplate = {
      name: templateName,
      type: menuType,
      description: description,
      items: menuItems.split(",").map((item) => item.trim()), // Split and trim items
      // You might want to add an emoji picker or assign a default emoji here
      emoji: "✨", // Placeholder emoji
    };
    onSaveTemplate(newTemplate); // Call the passed save handler

    // Reset form fields
    setTemplateName("");
    setMenuType("");
    setDescription("");
    setMenuItems("");
  };

  return (
    <div className="fixed inset-0 top-[64px] bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative mt-4">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)} // Use the correct prop setter here
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Modal Content */}
        <h2 className="text-xl font-semibold mb-2">Create New Menu Template</h2>
        <p className="text-sm text-gray-500 mb-4">
          Add a new menu template that can be assigned to any weekday
        </p>

        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Template Name</label>
            <input
              type="text"
              placeholder="e.g., Punjabi Special"
              className="w-full border rounded px-3 py-2"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Menu Type</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={menuType}
              onChange={(e) => setMenuType(e.target.value)}
            >
              <option value="">Select type</option>
              <option value="veg">Vegetarian</option>
              <option value="non-veg">Non-Vegetarian</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              placeholder="Brief description of the menu..."
              className="w-full border rounded px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Menu Items (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g., Dal Makhani, Butter Naan, Jeera Rice, Raita, Pickle"
              className="w-full border rounded px-3 py-2"
              value={menuItems}
              onChange={(e) => setMenuItems(e.target.value)}
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            {" "}
            {/* Use the correct prop setter here */}
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Template</Button>{" "}
          {/* Call handleSubmit */}
        </div>
      </div>
    </div>
  );
}

export default CreateTemplateModal; // Export with the new name
