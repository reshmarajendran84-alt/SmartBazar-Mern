import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);          
  const [totalPages, setTotalPages] = useState(1);

  const [category, setCategory] = useState(""); 
const [price,setPrice]=useState("");
const [sort,setSort]=useState("");
const [search,setSearch]=useState("");

  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/products", {
        params: { page, category,price,sort,search },
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
  }, [page, category,price,sort,search]); 

  return (
    <ProductContext.Provider
      value={{
        products,
        page,
        setPage,
        totalPages,
        category,
        setCategory,
        loadProducts,
        price,
        setPrice,
sort,
setSort,
search,
setSearch,
        loading,

      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);