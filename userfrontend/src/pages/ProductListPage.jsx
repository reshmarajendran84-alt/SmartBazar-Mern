import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
const[page,setPage]=useState(1);
const [category,setCategory] =useState("");
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await getProducts(page,category);
      setProducts(data.products);
      setTotalPages(data.totalPages); 
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 grid grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductListPage;