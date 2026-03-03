const Dashboard = () => {
  const stats = [
    { title: "Total Products", value: 120 },
    { title: "Total Categories", value: 12 },
    { title: "Total Orders", value: 560 },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((item, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition"
        >
          <p className="text-gray-500 text-sm">{item.title}</p>
          <h3 className="text-3xl font-bold mt-2 text-indigo-600">
            {item.value}
          </h3>
        </div>
      ))}
    </div>
  );
};
export default Dashboard;

// import { useEffect, useState } from "react";
// import { getProducts, getCategories, getOrders } from "../services/dashboardService";

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     totalProducts: 0,
//     totalCategories: 0,
//     totalOrders: 0,
//   });

//   useEffect(() => {
//     const loadStats = async () => {
//       try {
//         const products = await getProducts();
//         const categories = await getCategories();
//         const orders = await getOrders();

//         setStats({
//           totalProducts: products.length,
//           totalCategories: categories.length,
//           totalOrders: orders.length,
//         });
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     loadStats();
//   }, []);

//   const statsList = [
//     { title: "Total Products", value: stats.totalProducts },
//     { title: "Total Categories", value: stats.totalCategories },
//     { title: "Total Orders", value: stats.totalOrders },
//   ];

//   return (
//     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//       {statsList.map((item, i) => (
//         <div
//           key={i}
//           className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition"
//         >
//           <p className="text-gray-500 text-sm">{item.title}</p>
//           <h3 className="text-3xl font-bold mt-2 text-indigo-600">
//             {item.value}
//           </h3>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Dashboard;