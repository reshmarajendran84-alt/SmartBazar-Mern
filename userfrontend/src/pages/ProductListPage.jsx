// // ProductListPage.jsx
// import { useEffect, useState, useCallback } from "react"; // ← add useCallback here
// import { useSearchParams } from "react-router-dom";
// import ProductCard from "../components/ProductCard";
// import Pagination from "../components/Pagination";
// import CategoryFilter from "../components/CategoryFilter";
// import { getProducts } from "../services/productService";
// import { toast } from "react-toastify";

// const ProductListPage = () => {
//   const [params, setParams] = useSearchParams();

//   const page     = Number(params.get("page")) || 1;
//   const category = params.get("category") || "";
//   const search   = params.get("search")   || "";
//   const sort     = params.get("sort")     || "";
// const [loading, setLoading] = useState(false); // ← add this

//   const [products,   setProducts]   = useState([]);
//   const [totalPages, setTotalPages] = useState(1);

//   const loadProducts = useCallback(async () => {
//     try {
//       setLoading(true);
//       const { data } = await getProducts(page, category, search, sort);
//       setProducts(data.products);
//       setTotalPages(data.pages);
//     } catch (err) {
//       console.log(err);
//       toast.error("Failed to load products");
//     }finally{
//       setLoading(false);
//     }
//   }, [page, category, search, sort]);

//   useEffect(() => {        // ← only ONE useEffect
//     loadProducts();
//   }, [loadProducts]);

//   const handleSort = (value) => {
//     setParams((prev) => {
//       const newParams = new URLSearchParams(prev);
//       if(value){
//         newParams.set("sort", value);
//       }else{
//         newParams.delete("sort");

//       }      newParams.set("page", 1);

//       return newParams;
//     });
//   };

//   const handlePage = (newPage) => {
//     setParams((prev) => {
//       const newParams = new URLSearchParams(prev);
//       newParams.set("page", newPage);
//       return newParams;
//     });
//   };

//   return (
//     <div className="min-h-screen flex bg-gray-50">
//       <aside className="w-64 bg-white p-4 shadow">
//         <h2 className="font-bold mb-4">Categories</h2>
//         <CategoryFilter />
//         <h2 className="mt-4 font-bold">Sort</h2>
//         <select
//           value={sort}
//           onChange={(e) => handleSort(e.target.value)}
//           className="border px-2 py-1 rounded"
//         >
//           <option value="">Default</option>
//           <option value="price_asc">Price Low → High</option>
//           <option value="price_desc">Price High → Low</option>
//         </select>
//       </aside>

//     <main className="flex-1 p-6">
//   {loading ? (
//     <p className="text-gray-400 animate-pulse">Loading products...</p>
//   ) : products.length === 0 ? (
//     <p className="text-gray-500">
//       {search ? `No products found for "${search}"` : "No products found"}
//     </p>
//   ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {products.map((product) => (
//               <ProductCard key={product._id} product={product} />
//             ))}
//           </div>
//         )}
//         <Pagination page={page} setPage={handlePage} pages={totalPages} />
//       </main>
//     </div>
//   );
// };

// export default ProductListPage;

// ProductListPage.jsx
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import CategoryFilter from "../components/CategoryFilter";
import { getProducts } from "../services/productService";
import { toast } from "react-toastify";

const ProductListPage = () => {
  const [params, setParams] = useSearchParams();

  const page     = Number(params.get("page")) || 1;
  const category = params.get("category") || "";
  const search   = params.get("search")   || "";
  const sort     = params.get("sort")     || "";

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getProducts(page, category, search, sort);
      setProducts(data.products);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, category, search, sort]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Sorting handler
  const handleSort = (value) => {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value) newParams.set("sort", value);
      else newParams.delete("sort");
      newParams.set("page", 1);
      return newParams;
    });
  };

  // Pagination handler
  const handlePage = (newPage) => {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage);
      return newParams;
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white p-6 shadow-md">
        <h2 className="font-bold mb-4 text-lg">Categories</h2>
        <CategoryFilter />
        <h2 className="mt-6 font-bold mb-2 text-lg">Sort</h2>
        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Default</option>
          <option value="price_asc">Price Low → High</option>
          <option value="price_desc">Price High → Low</option>
        </select>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {loading ? (
          <p className="text-gray-400 animate-pulse text-center">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500 text-center">
            {search ? `No products found for "${search}"` : "No products found"}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <Pagination page={page} setPage={handlePage} pages={totalPages} />
        </div>
      </main>
    </div>
  );
};

export default ProductListPage;