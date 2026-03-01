import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);          
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState(""); 
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/products", {
        params: { page, category },
      });

      setProducts(data.products);
      setTotalPages(data.pages);
    } catch (err) {
      console.log("Load product error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, category]); 

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        page,
        setPage,
        totalPages,
        category,
        setCategory,
        loadProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);