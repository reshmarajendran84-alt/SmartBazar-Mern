import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct } from "../../services/productService";
import ProductForm from "./ProductForm";
import Table from "../../components/Table";
import PageContainer from "../../components/PageContainer";

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
      console.log("API product response", data);
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
    { key: "price", label: "Price" },
    { key: "stock", label: "Stock" },
    {
      key: "category",
      label: "Category",
      render: (item) => item.category?.name || "No category",
    },
        { key: "description", label: "Description" },

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
      className="w-12 h-12 object-cover rounded"
      alt="product"
    />
  ),
},
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/admin/products/${item._id}`)}
            className="text-green-600"
          >
            View
          </button>

          <button
            onClick={() => handleEdit(item)}
            className="text-blue-500"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(item._id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-5">
        <h2 className="text-xl font-bold">Products</h2>
<PageContainer>
  <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
</PageContainer>
      
 

      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table data={products} columns={columns} />
      )}

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