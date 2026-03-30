// // OrderPage.jsx
// import { useState, useEffect } from "react";
// import api from "../utils/api";
// import OrderCard from "./OrderCard";
// import { useNavigate } from "react-router-dom";

// const OrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const { data } = await api.get("/order/my-orders");
//         setOrders(data.orders);
//       } catch (err) {
//         console.error("Failed to fetch orders:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();
//   }, []);

//   const handleOrderUpdate = (updatedOrder) => {
//     setOrders((prev) =>
//       prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
//     );
//   };

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center">
//       <p className="text-gray-500 text-lg">Loading orders...</p>
//     </div>
//   );

//   if (!orders.length) return (
//     <div className="min-h-screen flex flex-col items-center justify-center gap-4">
//       <div className="text-center">
//         <p className="text-6xl mb-4">📦</p>
//         <p className="text-gray-500 text-lg font-medium">No orders found</p>
//         <p className="text-gray-400 text-sm mt-1">
//           Your orders will appear here after you shop
//         </p>
//       </div>
//       <button
//         onClick={() => navigate("/")}
//         className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
//       >
//         Start Shopping
//       </button>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="max-w-2xl mx-auto">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
//           <span className="text-sm text-gray-400">{orders.length} order(s)</span>
//         </div>
//         {orders.map((order) => (
//           <OrderCard
//             key={order._id}
//             order={order}
//             onCancel={handleOrderUpdate}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OrdersPage;

// OrdersPage.jsx
import { useState, useEffect } from "react";
import api from "../utils/api";
import OrderCard from "./OrderCard";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/order/my-orders");
        setOrders(data.orders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleOrderUpdate = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
    );
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg animate-pulse">Loading orders...</p>
      </div>
    );

  if (!orders.length)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-7xl mb-4">📦</p>
          <h3 className="text-gray-800 text-xl font-semibold">No orders found</h3>
          <p className="text-gray-400 text-sm mt-1">
            Your orders will appear here after you shop
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md"
        >
          Start Shopping
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-2 sm:gap-0">
          <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
          <span className="text-sm text-gray-400">{orders.length} order(s)</span>
        </div>

        {/* Orders list */}
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} onCancel={handleOrderUpdate} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
