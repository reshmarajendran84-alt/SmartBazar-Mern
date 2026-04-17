import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
});

const STATUS_COLORS = {
  Pending:   "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Shipped:   "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
};

const StatCard = ({ label, value, sub, color = "bg-white" }) => (
  <div className={`rounded-xl p-5 border border-gray-100 shadow-sm ${color}`}>
    <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
    <p className="text-2xl font-bold text-gray-800">{value ?? "—"}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get customer name from order (enhanced)
const getCustomerName = (order) => {
  // Priority 1: From populated userId
  if (order.userId?.name && order.userId.name !== "Guest") {
    return order.userId.name;
  }
  
  // Priority 2: From address.fullName (guest checkout)
  if (order.address?.fullName) {
    return order.address.fullName;
  }
  
  // Priority 3: From address.name (alternative field)
  if (order.address?.name) {
    return order.address.name;
  }
  
  // Priority 4: From userId with fallback
  if (order.userId?.name) {
    return order.userId.name;
  }
  
  // Priority 5: Check if there's any name in address object
  if (order.address) {
    const possibleName = order.address.fullName || order.address.name || order.address.customerName;
    if (possibleName) return possibleName;
  }
  
  // Debug log to see what data we have
  console.log("Order without name:", {
    id: order._id,
    userId: order.userId,
    address: order.address
  });
  
  // Final fallback
  return "Guest User";
};

// Helper function to get customer email (enhanced)
const getCustomerEmail = (order) => {
  if (order.userId?.email) return order.userId.email;
  if (order.address?.email) return order.address.email;
  return "No email";
};

// Helper function to get customer phone (enhanced)
const getCustomerPhone = (order) => {
  if (order.userId?.phone) return order.userId.phone;
  if (order.address?.phone) return order.address.phone;
  return null;
};
  useEffect(() => {
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      
      // Debug: Log recent orders to see address data
      console.log("Recent orders sample:", data.recentOrders?.slice(0, 2).map(order => ({
        id: order._id,
        userId: order.userId,
        address: order.address,
        fullName: order.address?.fullName,
        name: order.userId?.name
      })));
      
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchStats();
}, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 bg-red-50 rounded-xl border border-red-200">
        Error loading dashboard: {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Top stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={`₹${stats.totalRevenue?.toLocaleString("en-IN") || 0}`}
          sub="From delivered orders"
          color="bg-green-50"
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders || 0}
          sub={`${stats.orderStats?.pending || 0} pending`}
        />
        <StatCard
          label="Total Users"
          value={stats.totalUsers || 0}
          sub={`${stats.newUsersThisMonth || 0} new this month`}
        />
        <StatCard
          label="Total Products"
          value={stats.totalProducts || 0}
          sub={`${stats.outOfStockProducts || 0} out of stock`}
        />
      </div>

      {/* Order status breakdown */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Order status breakdown
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {stats.orderStats && Object.entries(stats.orderStats).map(([status, count]) => (
            <div
              key={status}
              className={`rounded-xl p-4 ${STATUS_COLORS[status] || "bg-gray-100 text-gray-700"}`}
            >
              <p className="text-xs font-medium opacity-70 capitalize mb-1">{status}</p>
              <p className="text-2xl font-bold">{count || 0}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Recent orders</h2>
          </div>
          <div className="divide-y">
            {!stats.recentOrders || stats.recentOrders.length === 0 ? (
              <p className="text-sm text-gray-400 p-5 text-center">No orders yet</p>
            ) : (
              stats.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition">
                  <div>
                    <p className="text-xs font-mono text-gray-500">
                      #{order._id?.slice(-8).toUpperCase() || "N/A"}
                    </p>
                    {/* ✅ FIX: Use helper function for customer name */}
                    <p className="text-sm font-medium text-gray-800">
                      {getCustomerName(order)}
                    </p>
                    {/* ✅ FIX: Use helper function for customer email */}
                    <p className="text-xs text-gray-400">
                      {getCustomerEmail(order)}
                    </p>
                    {/* ✅ ADD: Show phone number if available */}
                    {(order.userId?.phone || order.address?.phone) && (
                      <p className="text-xs text-gray-400">
                        📞 {order.userId?.phone || order.address?.phone}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      ₹{(order.total || 0).toLocaleString("en-IN")}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {order.status || "Pending"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top selling products */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Top selling products</h2>
          </div>
          <div className="divide-y">
            {!stats.topProducts || stats.topProducts.length === 0 ? (
              <p className="text-sm text-gray-400 p-5 text-center">No sales data yet</p>
            ) : (
              stats.topProducts.map((product, i) => (
                <div key={product._id || i} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition">
                  <span className="text-lg font-bold text-gray-300 w-6 text-center">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {product.name || "Unknown product"}
                    </p>
                    <p className="text-xs text-gray-400">
                      ₹{(product.revenue || 0).toLocaleString("en-IN")} revenue
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-indigo-600">
                      {product.totalSold || 0} sold
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;