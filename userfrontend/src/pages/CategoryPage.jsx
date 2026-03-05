import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import { getCategories } from "../../../adminfrontend/src/services/categoryService";

const CategoryPage = () => {
  const [products, setProducts] = useState([]);
const[page,setPage]=useState(1);
const [category,setCategory] =useState("");
const[categories,setCategories]=useState([]);
const[totalPages,setTotalPages]=useState(1);

  useEffect(() => {
    loadProducts();
  }, [page,category]);

  useEffect(()=>{
loadCategories();
  },[])

  const loadProducts = async () => {
    try {
      const { data } = await getProducts(page,category);
      setProducts(data.products);
      setTotalPages(data.totalPages); 
    } catch (err) {
      console.log(err);
    }
  };
  const loadCategories =async()=>{
    try{
        const {data} =await getCategories();
        setCategories(data);
    }catch(err){
        console.log(err);
    }
  };

  return (
        <div className="p-6 flex gap-6">

      {/* 🔥 CATEGORY SECTION */}
      <div className="w-1/4">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setCategory("")}
            className={`p-2 rounded ${
              category === "" ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setCategory(cat.name)}
              className={`p-2 rounded ${
                category === cat.name
                  ? "bg-black text-white"
                  : "bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 🔥 PRODUCT SECTION */}
      <div className="w-3/4 grid grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

    </div>
  );
};

export default CategoryPage;