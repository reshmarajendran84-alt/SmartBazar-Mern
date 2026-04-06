import { useEffect } from "react";
import { useAdminOrders } from "../context/OrderContext";
import FilterBar from "../components/FilterBar"; 
import OrderRow from "../components/OrderRow";

const StatCard = ({ label, value, color }) => (
  <div className={`rounded-xl p-4 ${color}`}>
    <p className="text-xs font-medium opacity-70 mb-1">{label}</p>
    <p className="text-2xl font-bold">{value ?? "—"}</p>
  </div>
);

const AdminOrdersPage = () => {
  const {
    orders,
    stats,
    loading,
    error,
    filter,
    search,
    fetchOrders,
    fetchStats,
  } = useAdminOrders();

  // Fetch orders whenever filter or search changes
  useEffect(() => {
    fetchOrders(filter, search);
  }, [filter, search, fetchOrders]);

  // Fetch stats once on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h1>

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <StatCard label="Total" value={stats.total} color="bg-gray-100 text-gray-800" />
          <StatCard label="Pending" value={stats.pending} color="bg-yellow-50 text-yellow-800" />
          <StatCard label="Shipped" value={stats.shipped} color="bg-blue-50 text-blue-800" />
          <StatCard label="Delivered" value={stats.delivered} color="bg-green-50 text-green-800" />
          <StatCard label="Cancelled" value={stats.cancelled} color="bg-red-50 text-red-800" />
        </div>
      )}

      {/* Filter + Search bar */}
      <FilterBar />

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
          <p className="text-gray-400">Loading orders...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          <p className="font-medium mb-1">Error loading orders</p>
          <p>{error}</p>
          <button
            onClick={() => fetchOrders(filter, search)}
            className="mt-3 text-sm text-red-700 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Orders table */}
      {!loading && !error && (
        <>
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-gray-500 font-medium">No orders found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try changing the filter or search term
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
              <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-gray-700">{orders.length}</span> orders
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {["Order ID", "Customer", "Date", "Total", "Payment", "Status", "Update"].map(h => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <OrderRow key={order._id} order={order} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminOrdersPage;