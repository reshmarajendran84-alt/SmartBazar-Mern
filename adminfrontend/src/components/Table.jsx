import React from "react";
const Table = ({ data = [], columns = [] }) => {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="p-4 text-left font-semibold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length ? (
              data.map((item, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="p-4">
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center p-6 text-gray-500"
                >
                  🚫 No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default React.memo(Table);