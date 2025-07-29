// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { useDispatch } from "react-redux";
// import { setNewTemplate } from "../../slice/menuSlice";
// import { v4 as uuidv4 } from "uuid";

// // The useSelector import is not used in this component, so it can be removed if not needed elsewhere.
// // import { useSelector } from "react-redux";

// function CreateTemplateModal({ isOpen, setIsOpen, onSaveTemplate }) {
//   // Local state for the form fields
//   const [templateName, setTemplateName] = useState("");
//   const [menuType, setMenuType] = useState("");
//   const [description, setDescription] = useState("");
//   const [menuItems, setMenuItems] = useState("");

//   const dispatch = useDispatch();
//   if (!isOpen) return null; // This is correct!

//   const handleSubmit = () => {
//     // Basic validation
//     if (!templateName || !menuType || !description || !menuItems) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     // Determine emoji based on menuType
//     let emoji = "";
//     if (menuType === "Vegetarian") {
//       emoji = "🟢";
//     } else if (menuType === "Non-Vegetarian") {
//       emoji = "🔴";
//     } else if (menuType === "Both") {
//       emoji = "🟠";
//     }

//     const newTemplate = {
//       menuName: templateName,
//       menuType: menuType,
//       description: description,
//       menuItems: menuItems.split(",").map((item) => item.trim()),
//       // emoji: emoji,
//     };

//     onSaveTemplate(newTemplate); // Call the passed save handler

//     //passing the data to the api

//     // dispatch to the redux slice (Add your dispatch logic here if needed)
//     dispatch(setNewTemplate(newTemplate));
//     console.log(newTemplate);

//     // Reset form fields
//     setTemplateName("");
//     setMenuType("");
//     setDescription("");
//     setMenuItems("");
//   };

//   return (
//     <div className="fixed inset-0 top-[64px] bg-black/50 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative mt-4">
//         {/* Close Button */}
//         <button
//           onClick={() => setIsOpen(false)} // This is correct!
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//         >
//           ✕
//         </button>

//         {/* Modal Content */}
//         <h2 className="text-xl font-semibold mb-2">Create New Menu Template</h2>
//         <p className="text-sm text-gray-500 mb-4">
//           Add a new menu template that can be assigned to any weekday
//         </p>

//         <div className="space-y-4">
//           <div>
//             <label htmlFor="templateName" className="block font-medium mb-1">
//               Template Name
//             </label>
//             <input
//               id="templateName"
//               type="text"
//               placeholder="e.g., Punjabi Special"
//               className="w-full border rounded px-3 py-2"
//               value={templateName}
//               onChange={(e) => setTemplateName(e.target.value)}
//             />
//           </div>

//           <div>
//             <label htmlFor="menuType" className="block font-medium mb-1">
//               Menu Type
//             </label>
//             <select
//               id="menuType"
//               className="w-full border rounded px-3 py-2"
//               value={menuType}
//               onChange={(e) => setMenuType(e.target.value)}
//             >
//               <option value="">Select type</option>
//               {/* Corrected values to match the conditions in handleSubmit */}
//               <option value="Vegetarian">Vegetarian</option>
//               <option value="Non-Vegetarian">Non-Vegetarian</option>
//               <option value="Both">Both</option>
//             </select>
//           </div>

//           <div>
//             <label htmlFor="description" className="block font-medium mb-1">
//               Description
//             </label>
//             <textarea
//               id="description"
//               placeholder="Brief description of the menu..."
//               className="w-full border rounded px-3 py-2"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </div>

//           <div>
//             <label htmlFor="menuItems" className="block font-medium mb-1">
//               Menu Items (comma separated)
//             </label>
//             <input
//               id="menuItems"
//               type="text"
//               placeholder="e.g., Dal Makhani, Butter Naan, Jeera Rice, Raita, Pickle"
//               className="w-full border rounded px-3 py-2"
//               value={menuItems}
//               onChange={(e) => setMenuItems(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Modal Actions */}
//         <div className="mt-6 flex justify-end gap-3">
//           <Button variant="ghost" onClick={() => setIsOpen(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit}>Create Template</Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CreateTemplateModal;

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setNewTemplate } from "../../slice/menuSlice";
import { v4 as uuidv4 } from "uuid";

function CreateTemplateModal({ isOpen, setIsOpen, onSaveTemplate }) {
  const [templateName, setTemplateName] = useState("");
  const [menuType, setMenuType] = useState("");
  const [description, setDescription] = useState("");
  const [menuItems, setMenuItems] = useState("");

  const dispatch = useDispatch();
  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!templateName || !menuType || !description || !menuItems) {
      alert("Please fill in all fields.");
      return;
    }

    let emoji = "";
    if (menuType === "Vegetarian") emoji = "🟢";
    else if (menuType === "Non-Vegetarian") emoji = "🔴";
    else if (menuType === "Both") emoji = "🟠";

    const newTemplate = {
      // id: uuidv4(), // Optional unique ID
      menuName: templateName.toString(),
      menuType: menuType.toString(),
      description: description.toString(),
      menuItems: menuItems.toString(),
    };

    try {
      // Send to backend
      const res = await fetch("http://172.26.33.78:8080/api/v1/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: newTemplate,
        body: JSON.stringify(newTemplate),
      });

      if (!res.ok) throw new Error("Failed to save menu template");
      const result = await res.json();
      console.log("Saved to backend:", result);

      console.log(result);
      dispatch(setNewTemplate(result.menuItems));
      onSaveTemplate(newTemplate); // notify parent

      // Reset form
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative mt-4">
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
