// import { useEffect, useState, useCallback } from "react";
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

//   const [loading, setLoading] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);

//   // Fetch products
//   const loadProducts = useCallback(async () => {
//     try {
//       setLoading(true);
//       const { data } = await getProducts(page, category, search, sort);
//       setProducts(data.products);
//       setTotalPages(data.pages);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load products");
//     } finally {
//       setLoading(false);
//     }
//   }, [page, category, search, sort]);

//   useEffect(() => {
//     loadProducts();
//   }, [loadProducts]);

//   // Sorting handler
//   const handleSort = (value) => {
//     setParams((prev) => {
//       const newParams = new URLSearchParams(prev);
//       if (value) newParams.set("sort", value);
//       else newParams.delete("sort");
//       newParams.set("page", 1);
//       return newParams;
//     });
//   };

//   // Pagination handler
//   const handlePage = (newPage) => {
//     setParams((prev) => {
//       const newParams = new URLSearchParams(prev);
//       newParams.set("page", newPage);
//       return newParams;
//     });
//   };

//   return (
//     <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
//       {/* Sidebar */}
//       <aside className="w-full lg:w-64 bg-white p-6 shadow-md">
//         <h2 className="font-bold mb-4 text-lg">Categories</h2>
//         <CategoryFilter />
//         <h2 className="mt-6 font-bold mb-2 text-lg">Sort</h2>
//         <select
//           value={sort}
//           onChange={(e) => handleSort(e.target.value)}
//           className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
//         >
//           <option value="">Default</option>
//           <option value="price_asc">Price Low → High</option>
//           <option value="price_desc">Price High → Low</option>
//         </select>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 p-6">
//         {loading ? (
//           <p className="text-gray-400 animate-pulse text-center">Loading products...</p>
//         ) : products.length === 0 ? (
//           <p className="text-gray-500 text-center">
//             {search ? `No products found for "${search}"` : "No products found"}
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {products.map((product) => (
//               <ProductCard key={product._id} product={product} />
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         <div className="mt-6 flex justify-center">
//           <Pagination page={page} setPage={handlePage} pages={totalPages} />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ProductListPage;


import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import CategoryFilter from "../components/CategoryFilter";
import { getProducts } from "../services/productService";
import { toast } from "react-toastify";

// ✅ Skeleton card for loading state
const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse space-y-3">
    <div className="bg-gray-200 h-44 rounded-lg" />
    <div className="bg-gray-200 h-4 rounded w-3/4" />
    <div className="bg-gray-200 h-4 rounded w-1/2" />
    <div className="bg-gray-200 h-8 rounded w-full" />
  </div>
);

const ProductListPage = () => {
  const [params, setParams] = useSearchParams();

  const page     = Number(params.get("page")) || 1;
  const category = params.get("category") || "";
  const search   = params.get("search")   || "";
  const sort     = params.get("sort")     || "";

  const [loading, setLoading]     = useState(false);
  const [products, setProducts]   = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setProducts([]);                    // ✅ clear stale products immediately
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

  // ✅ Sort — resets page to 1
  const handleSort = (value) => {
    setParams((prev) => {
      const p = new URLSearchParams(prev);
      if (value) p.set("sort", value);
      else p.delete("sort");
      p.set("page", 1);
      return p;
    });
  };

  // ✅ Pagination
  const handlePage = (newPage) => {
    setParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("page", newPage);
      return p;
    });
    window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ scroll to top on page change
  };

  const isEmpty = !loading && products.length === 0;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">

      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white p-6 shadow-md lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <h2 className="font-bold mb-4 text-lg text-gray-800">Categories</h2>
        <CategoryFilter />

        <h2 className="mt-6 font-bold mb-2 text-lg text-gray-800">Sort By</h2>
        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-lg w-full
                     focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Default</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">

        {/* Active filters bar */}
        {(search || category || sort) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {search && (
              <span className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full">
                Search: "{search}"
              </span>
            )}
            {category && (
              <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full">
                Category: {category}
              </span>
            )}
            {sort && (
              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                Sort: {sort === "price_asc" ? "Low → High" : "High → Low"}
              </span>
            )}
          </div>
        )}

        {/* ✅ Skeleton grid while loading */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
              alt="No results"
              className="w-24 mb-4 opacity-50"
            />
            <p className="text-gray-500 text-lg">
              {search ? `No results for "${search}"` : "No products found"}
            </p>
            {(search || category || sort) && (
              <button
                onClick={() => setParams({})}
                className="mt-4 text-indigo-600 hover:underline text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results count */}
            <p className="text-sm text-gray-400 mb-4">
              Showing {products.length} product{products.length !== 1 ? "s" : ""}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination page={page} setPage={handlePage} pages={totalPages} />
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductListPage;