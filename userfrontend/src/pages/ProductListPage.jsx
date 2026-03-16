// import { useEffect,useState } from "react"; 
// import { useSearchParams } from "react-router-dom";

// import ProductCard from "../components/ProductCard";
// import Pagination from "../components/Pagination";
// import { useProduct } from "../context/ProductContext";
// import CategoryFilter from "../components/CategoryFilter";
// import { getProducts } from "../services/productService";
// import {toast} from "react-toastify";
// const ProductListPage = () => {

// const [params, setParams] = useSearchParams();

// const page = Number(params.get("page")) || 1;
// const category = params.get("category") || "";
// // const search = params.get("search") || "";
// const sort = params.get("sort") || "";
// const [search,setSearch]=useState("");
// const [products,setProducts] = useState([]);
// const [totalPages,setTotalPages] = useState(1);
// useEffect(() => {

// loadProducts();

// }, [page,category,search,sort]);

// const loadProducts = async () => {

// try {

// const { data } = await getProducts(page,category,search,sort);

// setProducts(data.products);
// setTotalPages(data.pages);
// } catch(err){
//   console.log(err);
//   toast.error("Failed to load products");
// }};
// const handleSort=(value)=>{
// setParams({
//   page,category,search,sort:value
// });
// };

// const handlePage=(newPage)=>{
//   setParams({
//     page:newPage,
//     category,
//     search,
//     sort
//   });
// };

// return (
//   <div className="min-h-screen bg-gray-50 flex">

//     <aside className="w-64 bg-white p-4 shadow">

//       <h2 className="font-bold mb-4">Categories</h2>

//       <CategoryFilter />

//       <h2 className="mt-4 font-bold">Sort</h2>

//       <select
//         value={sort}
//         onChange={(e) => handleSort(e.target.value)}
//       >
//         <option value="">Default</option>
//         <option value="price_asc">Price Low → High</option>
//         <option value="price_desc">Price High → Low</option>
//       </select>

//     </aside>

//     <main className="flex-1 p-6">

//       <div className="grid grid-cols-4 gap-6">
//         {products.map((product) => (
//           <ProductCard key={product._id} product={product} />
//         ))}
//       </div>

//       <Pagination page={page} setPage={handlePage} pages={totalPages} />

//     </main>

//   </div>
// );
// };

// export default ProductListPage;

// pages/ProductListPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import CategoryFilter from "../components/CategoryFilter";
import { getProducts } from "../services/productService";
import { toast } from "react-toastify";

const ProductListPage = () => {
  const [params, setParams] = useSearchParams();

  const page = Number(params.get("page")) || 1;
  const category = params.get("category") || "";
  const search = params.get("search") || "";
  const sort = params.get("sort") || "";

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadProducts();
  }, [page, category, search, sort]);

  const loadProducts = async () => {
    try {
      const { data } = await getProducts(page, category, search, sort);
      setProducts(data.products);
      setTotalPages(data.pages);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load products");
    }
  };

  const handleSort = (value) => {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("sort", value);
      newParams.set("page", 1); // reset page
      return newParams;
    });
  };

  const handlePage = (newPage) => {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage);
      return newParams;
    });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 shadow">
        <h2 className="font-bold mb-4">Categories</h2>
        <CategoryFilter />

        <h2 className="mt-4 font-bold">Sort</h2>
        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">Default</option>
          <option value="price_asc">Price Low → High</option>
          <option value="price_desc">Price High → Low</option>
        </select>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        {products.length === 0 ? (
          <p className="text-gray-500">No products found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <Pagination page={page} setPage={handlePage} pages={totalPages} />
      </main>
    </div>
  );
};

export default ProductListPage;