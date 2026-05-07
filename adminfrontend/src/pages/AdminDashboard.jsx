import { useEffect, useState } from "react";
import api from "../utils/api";
// const BASE_URL = import.meta.env.VITE_API_URL;

// const getAuthHeaders = () => ({
//   "Content-Type": "application/json",
//   Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
// });

const STATUS_COLORS = {
  Pending:   "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Confirmed: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  Shipped:   "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  Delivered: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Cancelled: "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
};

const STATUS_DOT = {
  Pending:   "bg-amber-400",
  Confirmed: "bg-sky-500",
  Shipped:   "bg-violet-500",
  Delivered: "bg-emerald-500",
  Cancelled: "bg-rose-500",
};

const StatCard = ({ label, value, sub, icon, accent = "from-indigo-500 to-purple-400" }) => (
  <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden hover:shadow-md transition-shadow duration-200">
    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accent}`} />
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">{label}</p>
        <p className="text-3xl font-bold text-gray-900 leading-none">{value ?? "—"}</p>
        {sub && <p className="text-xs text-gray-400 mt-2 font-medium">{sub}</p>}
      </div>
      {icon && (
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${accent} bg-opacity-10 flex items-center justify-center text-lg opacity-80`}>
          {icon}
        </div>
      )}
    </div>
  </div>
);

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
);

const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
          <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="h-4 w-40 bg-gray-200 rounded mb-5" />
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

const getCustomerName = (order) => {
  if (order.userId?.name && order.userId.name !== "Guest") return order.userId.name;
  if (order.address?.fullName) return order.address.fullName;
  if (order.address?.name) return order.address.name;
  return "Guest User";
};

const getCustomerEmail = (order) => {
  if (order.userId?.email) return order.userId.email;
  if (order.address?.email) return order.address.email;
  return "No email";
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/dashboard/stats");

        // const contentType = res.headers.get("content-type") || "";
        // if (!contentType.includes("application/json")) {
        //   const text = await res.text();
        //   console.error("Non-JSON response:", text.slice(0, 300));
        //   throw new Error(`Server returned HTML (status ${res.status}) — check backend route`);
        // }

        // const data = await res.json();
        // if (!res.ok) throw new Error(data?.message || `Server error: ${res.status}`);
        setStats(res.data);
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
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Failed to load dashboard</h3>
          <p className="text-sm text-rose-500 break-words">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue?.toLocaleString("en-IN") || 0}`,
      sub: "From delivered orders",
      icon: "💰",
      accent: "from-emerald-500 to-teal-400",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders || 0,
      sub: `${stats.orderStats?.Pending || 0} pending approval`,
      icon: "📦",
      accent: "from-sky-500 to-blue-400",
    },
    {
      label: "Total Users",
      value: stats.totalUsers || 0,
      sub: `${stats.newUsersThisMonth || 0} new this month`,
      icon: "👤",
      accent: "from-violet-500 to-purple-400",
    },
    {
      label: "Total Products",
      value: stats.totalProducts || 0,
      sub: `${stats.outOfStockProducts || 0} out of stock`,
      icon: "🏷️",
      accent: "from-rose-500 to-pink-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor your store's performance at a glance</p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live data
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Order Status Breakdown
            </h2>
          </div>
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {stats.orderStats &&
              Object.entries(stats.orderStats).map(([status, count]) => (
                <div
                  key={status}
                  className="flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-2xl p-5 transition-colors duration-150 cursor-default"
                >
                  <span className={`w-2.5 h-2.5 rounded-full mb-3 ${STATUS_DOT[status] || "bg-gray-400"}`} />
                  <p className="text-2xl font-bold text-gray-900">{count || 0}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1 capitalize">{status}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Recent Orders</h2>
              <span className="text-xs text-gray-400 font-medium">{stats.recentOrders?.length || 0} shown</span>
            </div>
            <div className="flex-1 divide-y divide-gray-50">
              {!stats.recentOrders || stats.recentOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="text-3xl mb-3">📭</span>
                  <p className="text-sm text-gray-400 font-medium">No orders yet</p>
                </div>
              ) : (
                stats.recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors duration-100">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-mono font-semibold text-gray-400 tracking-wider mb-0.5">
                        #{order._id?.slice(-8).toUpperCase() || "N/A"}
                      </p>
                      <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
                        {getCustomerName(order)}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{getCustomerEmail(order)}</p>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <p className="text-sm font-bold text-gray-900 tabular-nums">
                        ₹{(order.total || 0).toLocaleString("en-IN")}
                      </p>
                      <span className={`inline-flex items-center mt-1.5 text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                        {order.status || "Pending"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Top Selling Products</h2>
              <span className="text-xs text-gray-400 font-medium">{stats.topProducts?.length || 0} products</span>
            </div>
            <div className="flex-1 divide-y divide-gray-50">
              {!stats.topProducts || stats.topProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="text-3xl mb-3">📉</span>
                  <p className="text-sm text-gray-400 font-medium">No sales data yet</p>
                </div>
              ) : (
                stats.topProducts.map((product, i) => (
                  <div key={product._id || i} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-100">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      i === 0 ? "bg-amber-100 text-amber-600"
                      : i === 1 ? "bg-gray-100 text-gray-500"
                      : i === 2 ? "bg-orange-50 text-orange-500"
                      : "bg-gray-50 text-gray-400"
                    }`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{product.name || "Unknown product"}</p>
                      <p className="text-xs text-gray-400 mt-0.5">₹{(product.revenue || 0).toLocaleString("en-IN")} revenue</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-bold text-indigo-600 tabular-nums">{product.totalSold || 0}</p>
                      <p className="text-[10px] text-gray-400 font-medium">units</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;