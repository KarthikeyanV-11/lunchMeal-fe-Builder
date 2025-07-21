import { createContext, useContext, useState } from "react";

const MenuContext = createContext(undefined);

// Default weekly menu data
const defaultWeeklyMenu = {
  monday: [
    "Sambar",
    "Rasam",
    "Phulka",
    "Curdrice",
    "Beetroot poriyal",
    "Appalam",
    "Pickle",
  ],
  tuesday: [
    "Veg pulao",
    "Phulka",
    "Curdrice",
    "Dal",
    "Salad",
    "Appalam",
    "Pickle",
  ],
  wednesday: [
    "Karakozhambu",
    "Rasam",
    "Phulka",
    "ChowChow kootu",
    "Curdrice",
    "Appalam",
    "Pickle",
  ],
  thursday: [
    "Sambar",
    "Rasam",
    "Phulka",
    "Potato poriyal",
    "Curdrice",
    "Appalam",
    "Pickle",
  ],
  friday: [
    "Jeera rice",
    "Phulka",
    "Sweet",
    "Curdrice",
    "Channa Masala",
    "Appalam",
    "Pickle",
  ],
};

export const MenuProvider = ({ children }) => {
  const [menus, setMenus] = useState({});

  const updateMenu = (date, items) => {
    setMenus((prev) => ({
      ...prev,
      [date]: items,
    }));
  };

  const deleteMenu = (date) => {
    setMenus((prev) => {
      const newMenus = { ...prev };
      delete newMenus[date];
      return newMenus;
    });
  };

  const getMenuForDate = (date) => {
    // First check if there's a specific menu for this date
    if (menus[date]) {
      return menus[date];
    }

    // If no specific menu, return default weekly menu based on day of week
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Skip weekends (Saturday = 6, Sunday = 0)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return null;
    }

    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayName = dayNames[dayOfWeek];

    return defaultWeeklyMenu[dayName] || null;
  };

  return (
    <MenuContext.Provider
      value={{ menus, updateMenu, deleteMenu, getMenuForDate }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
