import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

const ProductContext = createContext();
export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
        const res = await api.get("/admin/product");
setProducts(res.data);
console.log(res.data);

    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (formData) => {
    await api.post("/admin/products", formData);
    toast.success("Product created");
    loadProducts();
  };

  const updateProduct = async (id, formData) => {
    await api.put(`/admin/products/${id}`, formData);
    toast.success("Product updated");
    setEditing(null);
    loadProducts();
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/admin/products/${id}`);
    toast.success("Product deleted");
    loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        editing,
        setEditing,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
