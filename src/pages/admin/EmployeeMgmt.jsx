// import { useEffect, useState } from "react";
// import { Layout } from "../../components/shared/Layout";
// import axios from "axios";
// import { setEmployees } from "../../slice/employeeSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { setSubscriptionState } from "../../slice/authSlice";
// import { Button } from "../../components/ui/Button";
// import { toast } from "react-hot-toast";

// function EmployeeMgmt() {
//   // FINDING OUT THE TOTAL STRENGTH
//   const BASE_URL = import.meta.env.VITE_BACKEND_URL;

//   const today = new Date();
//   const year = today.getFullYear();
//   const month = today.getMonth();

//   //local states for the totalEmployees and totalSubscribers
//   // const [totalEmployees, setTotalEmployees] = useState([]);
//   const totalEmployees = useSelector((state) => state.employee.allEmployees);
//   console.log(totalEmployees);

//   const [totalSubscribers, setTotalSubscriber] = useState([]);
//   console.log(totalSubscribers);
//   const dispatch = useDispatch();

//   //   USE EFFECTS
//   // total employees -> redux
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await axios.get(
//           `${BASE_URL}/employee/getAllEmployees`, // url for fetching all the employee details
//         );
//         dispatch(setEmployees(res.data));
//       } catch (error) {
//         console.error("Error fetching employees:", error.message);
//       }
//     };

//     fetchEmployees();
//   }, [dispatch]);

//   //total subscription status -> local
//   useEffect(() => {
//     const fetchSubscriptions = async () => {
//       try {
//         const res = await axios.get(
//           `${BASE_URL}/subscription/active?month=${month + 1}&year=${year}`,
//         );
//         const allSubs = res.data;
//         console.log(allSubs);
//         setTotalSubscriber(allSubs);
//       } catch (error) {
//         console.error("Error fetching subscription:", error);
//         // setIsActive(false);
//       }
//     };

//     fetchSubscriptions();
//   }, []);

//   //dispatch to redux
//   async function handleSyncAllEmployees() {
//     try {
//       const res = await axios.post(`${BASE_URL}/employee/syncAllEmployees`);
//       dispatch(setEmployees(res.data));
//       toast.success("All Employees Synced Successfully!!!");
//     } catch (error) {
//       console.error("Error syncing employees:", error.message);
//     }
//   }

//   return (
//     <div>
//       <Layout>
//         <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//           <div className="flex justify-between items-center mb-8">
//             <h2 className="text-2xl font-bold text-orange-500">
//               Employee Management
//             </h2>
//             <Button onClick={handleSyncAllEmployees}>Sync All Employees</Button>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full border border-orange-300 rounded-lg overflow-hidden">
//               <thead>
//                 <tr className="bg-orange-500 text-white text-left">
//                   <th className="py-3 px-4">Name</th>
//                   <th className="py-3 px-4">Mobile</th>
//                   <th className="py-3 px-4">Email</th>
//                   <th className="py-3 px-4">Subscription Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {totalEmployees.map((currEmp) => {
//                   const empSubscription = totalSubscribers.find(
//                     (sub) => sub.employee?.id === currEmp?.id,
//                   );

//                   return (
//                     <tr
//                       key={currEmp?.id}
//                       className="border-t border-orange-200 hover:bg-orange-50 transition"
//                     >
//                       <td className="py-3 px-4 font-medium">
//                         {currEmp?.firstName}
//                       </td>
//                       <td className="py-3 px-4">{currEmp?.mobile}</td>
//                       <td className="py-3 px-4">{currEmp?.email}</td>
//                       <td
//                         className={`py-3 px-4 font-semibold ${
//                           empSubscription?.status === "ACTIVE"
//                             ? "text-green-600"
//                             : "text-red-500"
//                         }`}
//                       >
//                         {empSubscription ? empSubscription.status : "INACTIVE"}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </Layout>
//     </div>
//   );
// }

// export default EmployeeMgmt;
import { useEffect, useState } from "react";
import { Layout } from "../../components/shared/Layout";
import axios from "axios";
import { setEmployees, updateEmployees } from "../../slice/employeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/ui/Button";
import { toast } from "react-hot-toast";

function EmployeeMgmt() {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const totalEmployees = useSelector((state) => state.employee.allEmployees);
  console.log(totalEmployees);
  const [totalSubscribers, setTotalSubscriber] = useState([]);
  const dispatch = useDispatch();

  // ✅ Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/employee/getAllEmployees`);
        console.log(res.data);
        dispatch(setEmployees(res.data));
      } catch (error) {
        console.error("Error fetching employees:", error.message);
      }
    };
    fetchEmployees();
  }, [dispatch]);

  // ✅ Fetch subscriptions
  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/subscription/active?month=${month + 1}&year=${year}`,
      );
      console.log(res.data);
      setTotalSubscriber(res.data);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // ✅ Sync all employees
  async function handleSyncAllEmployees() {
    try {
      const res = await axios.post(`${BASE_URL}/employee/syncAllEmployees`);
      console.log(res.data);
      dispatch(updateEmployees(res.data));
      toast.success("All Employees Synced Successfully!!!");
    } catch (error) {
      console.error("Error syncing employees:", error.message);
    }
  }

  // ✅ Toggle subscription status
  async function handleChangeStatus(empId, currentStatus) {
    try {
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await axios.put(`${BASE_URL}/subscription/updateStatus/${empId}`, {
        status: newStatus,
      });

      toast.success(`Status changed to ${newStatus}`);
      fetchSubscriptions(); // refresh subscription state
    } catch (error) {
      console.error("Error updating status:", error.message);
      toast.error("Failed to update status");
    }
  }

  return (
    <div>
      <Layout>
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-orange-500">
              Employee Management
            </h2>
            <Button onClick={handleSyncAllEmployees}>Sync All Employees</Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-orange-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-orange-500 text-white text-left">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Subscription Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {totalEmployees.map((currEmp) => {
                  const empSubscription = totalSubscribers.find(
                    (sub) => sub.employee?.id === currEmp?.id,
                  );

                  const status = empSubscription?.status || "INACTIVE";

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
                          status === "ACTIVE"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {status === "ACTIVE" ? "Active" : "Inactive"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() =>
                            handleChangeStatus(currEmp?.id, status)
                          }
                          className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg hover:bg-orange-200 transition text-sm"
                        >
                          Change Status
                        </button>
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
