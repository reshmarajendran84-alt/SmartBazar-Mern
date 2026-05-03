import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct } from "../../services/productService";
import ProductForm from "./ProductForm";
import toast from "react-hot-toast";
import { FiPlus, FiEdit, FiTrash2, FiEye } from "react-icons/fi";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const navigate = useNavigate();

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getProducts();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleDelete = async (id) => {
    const toastId = toast.loading("Deleting...");
    try {
      await deleteProduct(id);
      toast.success("Product deleted", { id: toastId });
      setConfirmId(null);
      loadProducts();
    } catch {
      toast.error("Delete failed", { id: toastId });
    }
  };

  const columns = [
    {
      key: "name", label: "Name",
      render: (p) => <span className="font-medium text-sm text-gray-800 truncate block max-w-[160px]">{p.name}</span>,
    },
    {
      key: "price", label: "Price",
      render: (p) => <span className="text-indigo-600 font-medium text-sm">₹ {p.price}</span>,
    },
    {
      key: "stock", label: "Stock",
      render: (p) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          p.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>{p.stock}</span>
      ),
    },
    {
      key: "category", label: "Category",
      render: (p) => (
        <span className="bg-violet-100 text-violet-800 px-2.5 py-1 rounded-full text-xs font-medium">
          {p.category?.name || "—"}
        </span>
      ),
    },
    {
      key: "images", label: "Image",
      render: (p) => p.images?.length > 0
        ? <img src={p.images[0]} className="w-9 h-9 rounded-lg object-cover border border-gray-100" alt="" />
        : <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs">—</div>,
    },
    {
      key: "actions", label: "Actions",
      render: (p) => (
        <div className="flex items-center gap-1.5">
          <button onClick={() => navigate(`/admin/products/${p._id}`)}
            className="p-1.5 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition">
            <FiEye size={13} />
          </button>
          <button onClick={() => { setEditData(p); setShowForm(true); }}
            className="p-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition">
            <FiEdit size={13} />
          </button>
          {confirmId === p._id ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">Sure?</span>
              <button onClick={() => handleDelete(p._id)}
                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">Yes</button>
              <button onClick={() => setConfirmId(null)}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded hover:bg-gray-200">No</button>
            </div>
          ) : (
            <button onClick={() => setConfirmId(p._id)}
              className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition">
              <FiTrash2 size={13} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Product management</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage your store inventory</p>
        </div>
        <button onClick={() => { setEditData(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
          <FiPlus size={14} /> Add product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total products", val: products.length },
{ label: "In stock", val: products.filter(p => p.stock > 0).reduce((sum, p) => sum + p.stock, 0) },          { label: "Out of stock", val: products.filter(p => p.stock === 0).length },
          { label: "Categories", val: new Set(products.map(p => p.category?._id).filter(Boolean)).size },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-52 text-gray-400 text-sm">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center h-52 text-gray-400 text-sm">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map(col => (
                    <th key={col.key}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 transition">
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-3">
                        {col.render ? col.render(p) : p[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) { setShowForm(false); setEditData(null); } }}>
          <ProductForm
            onClose={() => { setShowForm(false); setEditData(null); }}
            refresh={loadProducts}
            editData={editData}
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;