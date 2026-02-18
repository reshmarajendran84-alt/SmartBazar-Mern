import api from "../../utils/api";
import { toast } from "react-toastify";

const ProductTable = ({ products, onEdit, onDelete }) => {
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/admin/product/${id}`);
      toast.success("Deleted");
      onDelete(); // reload products
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <table className="w-full border">
      <thead className="bg-gray-100">
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
{products?.map((p) => (
          <tr key={p._id} className="text-center border-t">
            <td>{p.name}</td>
            <td>{p.price}</td>
            <td>{p.stock}</td>
<td>{p.category?.name || "No Category"}</td>
            <td>
              <button
                onClick={() => onEdit(p)}
                className="text-blue-600 mr-2"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(p._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
