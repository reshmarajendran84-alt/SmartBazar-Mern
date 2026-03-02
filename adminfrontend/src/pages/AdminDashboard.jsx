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