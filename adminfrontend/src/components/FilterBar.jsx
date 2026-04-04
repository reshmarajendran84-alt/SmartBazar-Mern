import { useAdminOrders } from "../context/OrderContext";
import { useRef } from "react";

const STATUS_OPTIONS = ["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const FilterBar = () => {
  const { filter, setFilter, search, setSearch, fetchOrders } = useAdminOrders();
  const searchTimer = useRef(null);

  const handleFilterClick = (status) => {
    setFilter(status);
    fetchOrders(status, search);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchOrders(filter, e.target.value);
    }, 400);
  };

  return (
    <div className="bg-white rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-4">
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map(status => (
          <button
            key={status}
            onClick={() => handleFilterClick(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition
              ${filter === status
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="flex-1">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by order ID or customer name..."
          className="w-full border border-gray-200 rounded-lg px-4 py-2
            text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>
    </div>
  );
};

export default FilterBar;