import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct } from "../../services/productService";
import ProductForm from "./ProductForm";
import toast from "react-hot-toast";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getProducts();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      console.log(err.response?.data);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (id) => {
    if (!confirm("Delete product?")) return;
    const toastId = toast.loading("Deleting product...");
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully", { id: toastId });
      loadProducts();
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error("Failed to delete product", { id: toastId });
    }
  };

  const handleEdit = (product) => {
    setEditData(product);
    setShowForm(true);
  };

  const columns = [
    { key: "name", label: "Name" },
    {
      key: "price",
      label: "Price",
      render: (item) => (
        <span className="font-semibold text-indigo-600">₹ {item.price}</span>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            item.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          }`}
        >
          {item.stock}
        </span>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (item) => (
        <span className="bg-gray-100 px-2 py-1 rounded text-sm">
          {item.category?.name || "No category"}
        </span>
      ),
    },
    {
      key: "image",
      label: "Image",
      render: (item) => (
        <div className="flex gap-1">
          {item.images?.length > 0 ? (
            item.images.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-12 h-12 object-cover rounded-lg border"
                alt={`product-${i}`}
              />
            ))
          ) : (
            <img
              src="/no-image.png"
              className="w-12 h-12 object-cover rounded-lg border"
              alt="no-image"
            />
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate(`/admin/products/${item._id}`)}
            className="px-3 py-1 text-xs sm:text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
          >
            View
          </button>
          <button
            onClick={() => handleEdit(item)}
            className="px-3 py-1 text-xs sm:text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(item._id)}
            className="px-3 py-1 text-xs sm:text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Product Management
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 sm:px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition duration-300"
        >
          + Add Product
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <span className="text-gray-500 text-lg">Loading products...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="flex justify-center items-center h-60">
            <span className="text-gray-400 text-lg">No products found</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-auto">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-2 sm:px-4 py-2">
                        {col.render ? col.render(product) : product[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <>
          <div
            onClick={() => {
              setShowForm(false);
              setEditData(null);
            }}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 flex justify-center items-start sm:items-center p-4 sm:p-6 z-50 overflow-auto">
            <ProductForm
              onClose={() => {
                setShowForm(false);
                setEditData(null);
              }}
              refresh={loadProducts}
              editData={editData}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;