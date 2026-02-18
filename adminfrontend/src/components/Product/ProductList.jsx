import { useEffect } from "react";
import { useProduct } from "../../context/ProductContext";
import { Link } from "react-router-dom";

const ProductList = () => {
  const { products, loadProducts, deleteProduct, loading } = useProduct();

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Products</h2>

        <Link
          to="/admin/products/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </Link>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="text-center border-t">

              <td>{p.name}</td>

              <td>{p.category?.name}</td>

              <td>{p.stock}</td>

              <td>
                {p.isActive ? "✅ Active" : "❌ Inactive"}
              </td>

              <td className="space-x-2">

                <Link
                  to={`/admin/products/edit/${p._id}`}
                  className="bg-yellow-400 px-3 py-1 rounded"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteProduct(p._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
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

export default ProductList;
