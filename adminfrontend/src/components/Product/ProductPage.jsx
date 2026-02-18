import { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";
import api from "../../utils/api";
import { toast } from "react-toastify";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = async () => {
    try {
      const res = await api.get("/admin/product");
setProducts(res.data.products);
    } catch {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddClick = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditing(product);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditing(null);
    loadProducts();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Products</h2>

 <button
  onClick={handleAddClick}
  className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
>
  + Add Product
</button>

   

      {showForm && (
        <ProductForm editing={editing} onSuccess={loadProducts} />
      )}

<ProductTable products={products} onEdit={handleEdit} onDelete={loadProducts} />
    </div>
  );
};

export default ProductPage;
