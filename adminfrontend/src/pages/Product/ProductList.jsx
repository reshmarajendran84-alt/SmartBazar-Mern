import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct } from "../../services/productService";
import ProductForm from "./ProductForm";
import Table from "../../components/Table";

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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (id) => {
    if (confirm("Delete product?")) {
      await deleteProduct(id);
      loadProducts();
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
        <span className="font-semibold text-indigo-600">
          ₹ {item.price}
        </span>
      ),
    },

    {
      key: "stock",
      label: "Stock",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            item.stock > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
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
        <img
          src={
            item.images?.[0]
              ? `http://localhost:5000/${item.images[0]}`
              : "/no-image.png"
          }
          className="w-14 h-14 object-cover rounded-lg border"
          alt="product"
        />
      ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/admin/products/${item._id}`)}
            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            View
          </button>

          <button
            onClick={() => handleEdit(item)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(item._id)}
            className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <h2 className="text-2xl font-bold text-gray-800">
          Product Management
        </h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          + Add Product
        </button>

      </div>

      {/* Table Card */}
      <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">

        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading products...
          </div>
        ) : (
          <Table data={products} columns={columns} />
        )}

      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          refresh={loadProducts}
          editData={editData}
        />
      )}

    </div>
  );
};

export default ProductList;