import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
});

const STATUS_COLORS = {
  pending:   "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped:   "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

const StatCard = ({ label, value, sub, color = "bg-white" }) => (
  <div className={`rounded-xl p-5 border border-gray-100 shadow-sm ${color}`}>
    <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
    <p className="text-2xl font-bold text-gray-800">{value ?? "—"}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
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

      {/* ── Top stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
          sub="From delivered orders"
          color="bg-green-50"
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          sub={`${stats.orderStats.pending} pending`}
        />
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          sub={`${stats.newUsersThisMonth} new this month`}
        />
        <StatCard
          label="Total Products"
          value={stats.totalProducts}
          sub={`${stats.outOfStockProducts} out of stock`}
        />
      </div>

      {/* ── Order status breakdown ── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Order status breakdown
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(stats.orderStats).map(([status, count]) => (
            <div
              key={status}
              className={`rounded-xl p-4 ${STATUS_COLORS[status] || "bg-gray-100 text-gray-700"}`}
            >
              <p className="text-xs font-medium opacity-70 capitalize mb-1">{status}</p>
              <p className="text-2xl font-bold">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom two columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent orders */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Recent orders</h2>
          </div>
          <div className="divide-y">
            {stats.recentOrders.length === 0 ? (
              <p className="text-sm text-gray-400 p-5">No orders yet</p>
            ) : stats.recentOrders.map(order => (
              <div key={order._id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-xs font-mono text-gray-500">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {order.userId?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-400">{order.userId?.email || ""}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">
                    ₹{order.total?.toLocaleString("en-IN")}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${STATUS_COLORS[order.status?.toLowerCase()] || "bg-gray-100 text-gray-600"}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top selling products */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Top selling products</h2>
          </div>
          <div className="divide-y">
            {stats.topProducts.length === 0 ? (
              <p className="text-sm text-gray-400 p-5">No sales data yet</p>
            ) : stats.topProducts.map((product, i) => (
              <div key={product._id} className="flex items-center gap-4 px-5 py-3">
                <span className="text-lg font-bold text-gray-200 w-6 text-center">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {product.name || "Unknown product"}
                  </p>
                  <p className="text-xs text-gray-400">
                    ₹{product.revenue?.toLocaleString("en-IN")} revenue
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-indigo-600">
                    {product.totalSold} sold
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;