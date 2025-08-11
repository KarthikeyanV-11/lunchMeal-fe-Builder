import { useEffect, useState } from "react";
import { Layout } from "../../components/shared/Layout";
import axios from "axios";
import { setEmployees } from "../../slice/employeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { setSubscriptionState } from "../../slice/authSlice";

function EmployeeMgmt() {
  // FINDING OUT THE TOTAL STRENGTH
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const [totalEmployees, setTotalEmployees] = useState([]);
  console.log(totalEmployees);
  const [totalSubscribers, setTotalSubscriber] = useState([]);
  console.log(totalSubscribers);
  const dispatch = useDispatch();

  const employeeStrength = useSelector((state) => state.employee.allEmployees);

  console.log(employeeStrength);

  //   USE EFFECTS
  // total employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/employee/getAllEmployees`, // url for fetching all the employee details
        );

        const employeesArray = response.data;
        // console.log(employeesArray[0]); getting the first user

        setTotalEmployees(employeesArray);
      } catch (error) {
        console.error("Error fetching employees:", error.message);
      }
    };

    fetchEmployees();
  }, [dispatch]);

  //total subscription status
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/subscription/active?month=${month + 1}&year=${year}`,
        );
        const allSubs = res.data;
        console.log(allSubs);
        setTotalSubscriber(allSubs);
      } catch (error) {
        console.error("Error fetching subscription:", error);
        // setIsActive(false);
      }
    };

    fetchSubscriptions();
  }, []);

  return (
    <div>
      <Layout>
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-orange-500">
              Employee Management
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-orange-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-orange-500 text-white text-left">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Subscription Status</th>
                </tr>
              </thead>
              <tbody>
                {totalEmployees.map((currEmp) => {
                  const empSubscription = totalSubscribers.find(
                    (sub) => sub.employee?.id === currEmp?.id,
                  );

                  return (
                    <tr
                      key={currEmp?.id}
                      className="border-t border-orange-200 hover:bg-orange-50 transition"
                    >
                      <td className="py-3 px-4 font-medium">
                        {currEmp?.firstName}
                      </td>
                      <td className="py-3 px-4">{currEmp?.mobile}</td>
                      <td className="py-3 px-4">{currEmp?.email}</td>
                      <td
                        className={`py-3 px-4 font-semibold ${
                          empSubscription?.status === "ACTIVE"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {empSubscription ? empSubscription.status : "INACTIVE"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default EmployeeMgmt;
