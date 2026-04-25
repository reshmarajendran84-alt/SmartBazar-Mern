import React from "react";

const Table = ({ data = [], columns = [], className = "" }) => {
  return (
    <div className={`bg-white rounded-xl shadow-card border border-dark-200 overflow-hidden ${className}`}>
      {/* Mobile Card View (visible on small screens) */}
      <div className="block md:hidden divide-y divide-dark-100">
        {data.length === 0 ? (
          <div className="text-center py-12 text-dark-400">
            🚫 No data found
          </div>
        ) : (
          data.map((item, index) => (
            <div key={index} className="p-4 space-y-2">
              {columns.map((col) => (
                <div key={col.key} className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    {col.label}
                  </span>
                  <div className="text-sm text-dark-700 text-right max-w-[60%]">
                    {col.render ? col.render(item) : item[col.key]}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-dark-50 border-b border-dark-200">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-dark-600 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-dark-400">
                  🚫 No data found
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index} className="border-b border-dark-100 hover:bg-dark-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-dark-700">
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(Table);