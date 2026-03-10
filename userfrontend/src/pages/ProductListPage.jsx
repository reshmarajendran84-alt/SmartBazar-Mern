import { useState } from "react";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { useProduct } from "../context/ProductContext";
import CategoryFilter from "../components/CategoryFilter";
const ProductListPage = () => {


const { products, page, setPage, category, setCategory, price, setPrice, sort, setSort, totalPages } = useProduct();
  return (
    <div className="min-h-screen bg-gray-50 flex">

      <aside className="w-64 bg-white p-4 shadow">

        <h2 className="font-bold mb-4">Categories</h2>

       <CategoryFilter />
        {/* <h2 className="mt-4 font-bold">Price</h2>

        <input
          type="range"
          min="0"
          max="200000"
          step="100"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full"
        />

        <p className="mt-2 text-sm text-gray-600">
          Max Price: ₹{price}
        </p> */}

        <h2 className="mt-4 font-bold">Sort</h2>

  <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >          <option value="">Default</option>
          <option value="price_asc">Price Low → High</option>
          <option value="price_desc">Price High → Low</option>
        </select>

      </aside>

      <main className="flex-1 p-6">

        
        <div className="grid grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>


<Pagination page={page} setPage={setPage} pages={totalPages} />
      </main>

    </div>
  );
};

export default ProductListPage;