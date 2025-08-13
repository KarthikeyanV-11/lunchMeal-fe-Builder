import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../components/ui/Button";

export default function UpdateTemplateModal({
  isOpen,
  setIsOpen,
  template,
  onUpdateTemplate,
}) {
  const [formData, setFormData] = useState({
    menuName: "",
    description: "",
    menuType: "VEG",
    menuItems: "",
  });

  const modalRef = useRef();

  // Prefill form when modal opens
  useEffect(() => {
    if (template) {
      setFormData({
        menuName: template.menuName,
        description: template.description,
        menuType: template.menuType,
        menuItems: template.menuItems,
      });
    }
  }, [template]);

  // Close on outside click
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [setIsOpen]);

  // Attach outside click listener
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateTemplate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-100"
      >
        <h2 className="text-2xl font-bold text-orange-500 mb-5 border-b pb-2">
          Update Template
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Menu Name
            </label>
            <input
              name="menuName"
              value={formData.menuName}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              placeholder="Menu Name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              placeholder="Description"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Menu Type
            </label>
            <select
              name="menuType"
              value={formData.menuType}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            >
              <option value="VEG">Vegetarian</option>
              {/* <option value="NON_VEG">NON_VEG</option>
              <option value="BOTH">BOTH</option> */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Menu Items
            </label>
            <input
              name="menuItems"
              value={formData.menuItems}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              placeholder="Menu Items"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
