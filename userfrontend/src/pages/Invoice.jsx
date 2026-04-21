import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../utils/api";

const InvoicePage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/order/${id}`).then(({ data }) => setOrder(data.order));
  }, [id]);

  const handlePrint = () => window.print();

  if (!order) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white" id="invoice">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Invoice</h1>
        <button onClick={handlePrint}
          className="print:hidden bg-blue-600 text-white px-4 py-2 rounded text-sm">
          Download / Print
        </button>
      </div>

      <p className="text-sm text-gray-500">Order # {order._id?.slice(-8).toUpperCase()}</p>
      <p className="text-sm text-gray-500 mb-6">
        Date: {new Date(order.createdAt).toLocaleDateString("en-IN")}
      </p>

      <table className="w-full text-sm border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left">Item</th>
            <th className="p-2 text-right">Qty</th>
            <th className="p-2 text-right">Price</th>
            <th className="p-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.cartItems?.map((item, i) => (
            <tr key={i} className="border-t border-gray-100">
              <td className="p-2">{item.name}</td>
              <td className="p-2 text-right">{item.quantity}</td>
              <td className="p-2 text-right">₹{item.price}</td>
              <td className="p-2 text-right">₹{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-300 font-semibold">
            <td colSpan={3} className="p-2 text-right">Grand Total</td>
            <td className="p-2 text-right">₹{order.total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default InvoicePage;