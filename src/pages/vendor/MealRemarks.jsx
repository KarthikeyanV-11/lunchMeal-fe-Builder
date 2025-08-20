// import axios from "axios";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// function MealRemarks() {
//   const BASE_URL = import.meta.env.VITE_BACKEND_URL;
//   const [remarks, setRemarks] = useState([]);

//   useEffect(() => {
//     async function fetchRemarks() {
//       try {
//         const res = await axios.get(`${BASE_URL}/rating/all`);
//         console.log(res.data);
//         setRemarks(res.data);
//       } catch (error) {
//         toast.error(error);
//       }
//     }
//     fetchRemarks();
//   }, []);
//   return (
//     <div>
//       <Layout>
//         <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-orange-500">
//               Remarks from Employees
//             </h2>
//           </div>
//         </div>
//       </Layout>
//     </div>
//   );
// }

// export default MealRemarks;
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Layout } from "../../components/shared/Layout";
import { Star } from "lucide-react";

function MealRemarks() {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [remarks, setRemarks] = useState([]);

  useEffect(() => {
    async function fetchRemarks() {
      try {
        const res = await axios.get(`${BASE_URL}/rating/all`);
        setRemarks(res.data);
      } catch (error) {
        toast.error("Failed to load remarks");
      }
    }
    fetchRemarks();
  }, []);

  // ⭐ Utility to render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? "text-orange-500 fill-orange-500" : "text-gray-300"
          }`}
        />,
      );
    }
    return stars;
  };

  return (
    <div>
      <Layout>
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-orange-500">
              Remarks from Employees
            </h2>
          </div>

          {/* Remarks List */}
          {remarks.length === 0 ? (
            <p className="text-gray-500 text-center">No remarks available</p>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {remarks.map((feedback, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start border-b pb-3"
                >
                  <div>
                    <p className="text-base font-medium text-gray-800">
                      {feedback.remarks}
                    </p>
                    <p className="text-sm text-gray-500">
                      {feedback.employee?.firstName}{" "}
                      {feedback.employee?.lastName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(feedback.rating)}
                    <span className="ml-1 text-sm text-orange-600 font-semibold">
                      {feedback.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
}

export default MealRemarks;
