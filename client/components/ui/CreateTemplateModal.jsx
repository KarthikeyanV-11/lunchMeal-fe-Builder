import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { useDispatch } from "react-redux";
import { setNewTemplate } from "../../slice/menuSlice";

function CreateTemplateModal({ isOpen, setIsOpen, onSaveTemplate }) {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [templateName, setTemplateName] = useState("");
  const [menuType, setMenuType] = useState("");
  const [description, setDescription] = useState("");
  const [menuItems, setMenuItems] = useState("");

  const modalRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!templateName || !menuType || !description || !menuItems) {
      alert("Please fill in all fields.");
      return;
    }

    const newTemplate = {
      menuName: templateName.toString(),
      menuType: menuType.toString(),
      description: description.toString(),
      menuItems: menuItems.toString(),
    };

    try {
      const res = await fetch(`${BASE_URL}/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTemplate),
      });

      if (!res.ok) throw new Error("Failed to save menu template");
      const result = await res.json();
      console.log("Saved to backend:", result);

      dispatch(setNewTemplate(result));
      if (onSaveTemplate) onSaveTemplate(result);

      // Reset
      setTemplateName("");
      setMenuType("");
      setDescription("");
      setMenuItems("");
      setIsOpen(false);
    } catch (err) {
      console.error("Error saving template:", err);
      alert("Something went wrong while saving the template.");
    }
  };

  return (
    <div className="fixed inset-0 top-[64px] bg-black/50 z-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative mt-4"
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-2">Create New Menu Template</h2>
        <p className="text-sm text-gray-500 mb-4">
          Add a new menu template that can be assigned to any weekday
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="templateName" className="block font-medium mb-1">
              Template Name
            </label>
            <input
              id="templateName"
              type="text"
              placeholder="e.g., Punjabi Special"
              className="w-full border rounded px-3 py-2"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="menuType" className="block font-medium mb-1">
              Menu Type
            </label>
            <select
              id="menuType"
              className="w-full border rounded px-3 py-2"
              value={menuType}
              onChange={(e) => setMenuType(e.target.value)}
            >
              <option value="">Select type</option>
              <option value="Veg">Vegetarian</option>
              <option value="Non_Veg">Non-Vegetarian</option>
              <option value="Both">Both</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Brief description of the menu..."
              className="w-full border rounded px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="menuItems" className="block font-medium mb-1">
              Menu Items (comma separated)
            </label>
            <input
              id="menuItems"
              type="text"
              placeholder="e.g., Dal Makhani, Butter Naan, Jeera Rice, Raita"
              className="w-full border rounded px-3 py-2"
              value={menuItems}
              onChange={(e) => setMenuItems(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Template</Button>
        </div>
      </div>
    </div>
  );
}

export default CreateTemplateModal;
