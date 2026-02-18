import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 LOAD PRODUCTS
  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/product");
      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 CREATE
  const createProduct = async (formData) => {
    try {
      await api.post("/admin/product", formData);
      toast.success("Product created ✅");
      loadProducts();
    } catch (err) {
      toast.error("Create failed");
    }
  };

  // 🔹 UPDATE
  const updateProduct = async (id, formData) => {
    try {
      await api.put(`/admin/product/${id}`, formData);
      toast.success("Product updated ✏️");
      loadProducts();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // 🔹 DELETE
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/admin/product/${id}`);
      toast.success("Product deleted 🗑");
      loadProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        createProduct,
        updateProduct,
        deleteProduct,
        loadProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
