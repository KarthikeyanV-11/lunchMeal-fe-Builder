// import { createContext, useContext, useState } from "react";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { setFetchedMenu, setNewTemplate } from "../slice/menuSlice";

// const MenuContext = createContext(undefined);

// export const MenuProvider = ({ children }) => {
//   const [menus, setMenus] = useState({});
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();

//   const fetchMenuForDate = async (date) => {
//     if (menus[date]) return menus[date]; // Return from local cache if exists

//     try {
//       setLoading(true);

//       // 👇 API call to fetch menu for the given date
//       const response = await axios.get(`/api/v1/menu/${date}`);
//       const menuItems = response.data.menuItems || [];

//       // Update local state (caching)
//       setMenus((prev) => ({
//         ...prev,
//         [date]: menuItems,
//       }));

//       // Update Redux store
//       dispatch(setFetchedMenu({ date, menu: menuItems }));
//       // dispatch(setNewTemplate(menuItems));
//       return menuItems;
//     } catch (error) {
//       console.error("Error fetching menu:", error);
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <MenuContext.Provider value={{ fetchMenuForDate, loading }}>
//       {children}
//     </MenuContext.Provider>
//   );
// };

// export const useMenu = () => {
//   const context = useContext(MenuContext);
//   if (context === undefined) {
//     throw new Error("useMenu must be used within a MenuProvider");
//   }
//   return context;
// };

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setFetchedMenu, setNewTemplate } from "../slice/menuSlice";

const MenuContext = createContext(undefined);

export const MenuProvider = ({ children }) => {
  const [menus, setMenus] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          "http://172.26.33.78:8080/api/v1/menu/all",
        );
        const templates = response.data;
        console.log(templates);
        dispatch(setNewTemplate(templates));
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchTemplates();
  }, [dispatch]);

  const fetchMenuForDate = async (date) => {
    try {
      setLoading(true);

      // 👇 API call to fetch weekly menu data
      const response = await axios.get(`/api/v1/menuSchedule/${date}`);
      const weeklyData = response.data;

      // Create a key like "2025-07-21_to_2025-07-25"
      const key = `${weeklyData.startDate}_to_${weeklyData.endDate}`;

      // Return from local cache if already fetched
      if (menus[key]) return menus[key];

      // Cache locally
      setMenus((prev) => ({
        ...prev,
        [key]: weeklyData,
      }));

      // Dispatch to Redux store
      dispatch(setFetchedMenu({ key, week: weeklyData }));

      return weeklyData;
    } catch (error) {
      console.error("Error fetching weekly menu:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <MenuContext.Provider value={{ fetchMenuForDate, loading }}>
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
