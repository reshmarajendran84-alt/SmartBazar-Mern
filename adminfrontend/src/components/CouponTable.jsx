const CouponTable = ({ coupons, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Code</th>
            <th>Discount</th>
            <th>Min Order</th>
            <th>Expiry</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {coupons.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="p-3 font-semibold">{c.code}</td>
              <td>{c.discountPercent}%</td>
              <td>₹{c.minOrderAmount}</td>
              <td>{new Date(c.expiryDate).toLocaleDateString()}</td>

              <td>
                {c.isActive  && new Date(c.expiryDate) >new Date() ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-500">Inactive</span>
                )}
              </td>

              <td className="space-x-2">
                <button
                  onClick={() => onEdit(c)}
                  className="text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(c._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponTable;