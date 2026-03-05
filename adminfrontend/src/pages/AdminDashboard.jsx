import React from "react";

const AdminDashboard = () => {
  const stats = [
    { title: "Total Products", value: 120 },
    { title: "Total Categories", value: 8 },
    { title: "Orders", value: 45 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="p-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {stats.map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-gray-500 text-sm">
                {item.title}
              </h2>

              <p className="text-3xl font-bold mt-2">
                {item.value}
              </p>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;