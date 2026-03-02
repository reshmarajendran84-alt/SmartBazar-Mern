const PageContainer = ({ title, children, action }) => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {action}
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;