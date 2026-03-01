import React from "react";

const Table = ({ data = [], columns = [] }) => {
  return (
    <table className="w-full border">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="p-3 text-left">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.length > 0 ? (
          data.map((item, index) => (
            <tr key={index} className="border-t">
              {columns.map((col) => (
                <td key={col.key} className="p-3">
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="p-3 text-center">
              No data found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default React.memo(Table);