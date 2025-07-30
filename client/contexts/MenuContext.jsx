import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setFetchedMenu,
  setNewTemplate,
  setFetchedDayMenu,
} from "../slice/menuSlice";

const MenuContext = createContext(undefined);

export const MenuProvider = ({ children }) => {
  const [menus, setMenus] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch all available templates
  const fetchTemplates = async () => {
    try {
      const response = await axios.get(
        "http://192.168.3.121:8080/api/v1/menu/all",
      );
      const templates = response.data;

      if (Array.isArray(templates)) {
        templates.forEach((template) => {
          dispatch(setNewTemplate(template));
        });
      } else {
        dispatch(setNewTemplate(templates));
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  // Fetch menus for a specific week by date
  // const fetchMenuForDate = async (date) => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(
  //       `http://192.168.3.121:8080/api/v1/menuSchedule/${date}`,
  //     );
  //     const weeklyData = response.data;
  //     const key = `${weeklyData.startDate}_to_${weeklyData.endDate}`;

  //     if (!menus[key]) {
  //       setMenus((prev) => ({
  //         ...prev,
  //         [key]: weeklyData,
  //       }));
  //       dispatch(setFetchedMenu({ key, week: weeklyData }));
  //     }

  //     return weeklyData;
  //   } catch (error) {
  //     console.error("Error fetching weekly menu:", error);
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchMenuForDate = useCallback(
    async (date) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/menuSchedule/byDate?date=${date}`,
        );
        const dayMenu = response.data;
        setMenus((prev) => ({
          ...prev,
          [date]: dayMenu,
        }));
        dispatch(setFetchedDayMenu({ key: date, dayMenu }));
        return dayMenu;
      } catch (error) {
        console.error("Error fetching day menu:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [dispatch, BASE_URL],
  );

  // Fetch all menus for a specific month and year
  const fetchMenuByMonth = async (month, year) => {
    try {
      setLoading(true);

      console.log(`📅 Fetching month schedule for ${month}/${year}...`);

      const response = await axios.get(
        `http://192.168.3.121:8080/api/v1/menuSchedule/byMonthAndYear?month=${month}&year=${year}`,
      );
      const monthData = response.data;
      console.log("✅ Monthly menu data fetched:", monthData);

      const formatted = {};
      monthData.forEach((week) => {
        const key = `${week.startDate}_to_${week.endDate}`;
        formatted[key] = week;
        dispatch(setFetchedMenu({ key, week }));
      });
      console.log("📦 Raw response from backend:", response);
      console.log("✅ monthData:", monthData);

      setMenus((prev) => ({ ...prev, ...formatted }));
    } catch (error) {
      console.error("Error fetching monthly schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new template
  const addNewTemplate = async (data) => {
    try {
      const response = await axios.post(
        "http://192.168.3.121:8080/api/v1/menu",
        data,
      );
      const result = response.data;

      if (result?.menuItems) {
        dispatch(setNewTemplate(result));
      }
    } catch (error) {
      console.error("Error adding new template:", error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <MenuContext.Provider
      value={{
        fetchTemplates,
        fetchMenuForDate,
        fetchMenuByMonth,
        addNewTemplate,
        loading,
      }}
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
