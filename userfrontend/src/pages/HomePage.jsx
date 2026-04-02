import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";

const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse space-y-3">
    <div className="bg-gray-200 h-44 rounded-lg" />
    <div className="bg-gray-200 h-4 rounded w-3/4" />
    <div className="bg-gray-200 h-4 rounded w-1/2" />
    <div className="bg-gray-200 h-8 rounded w-full" />
  </div>
);

function HomePage() {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        getProducts(1, "", "", ""),
        getCategories(),
      ]);
      setProducts(prodRes.data.products || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero Banner */}
      <section className="px-4 md:px-8 mt-6">
        <div className="h-48 sm:h-64 md:h-72 rounded-2xl overflow-hidden
                        bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600
                        flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3">SmartBazar</h1>
            <p className="text-lg md:text-xl opacity-90 mb-5">
              Best deals on electronics & more
            </p>
            <Link
              to="/products"
              className="bg-white text-indigo-600 font-semibold px-6 py-2
                         rounded-full hover:bg-indigo-50 transition"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 md:px-8 mt-6">
        <h2 className="text-gray-700 font-semibold text-lg mb-3">Shop by Category</h2>
        <div className="flex gap-3 flex-wrap">
          <Link
            to="/products"
            className="text-indigo-600 bg-white px-5 py-2 rounded-full shadow text-sm
                       hover:bg-indigo-600 hover:text-white transition"
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}`}
              className="text-indigo-600 bg-white px-5 py-2 rounded-full shadow text-sm
                         hover:bg-indigo-600 hover:text-white transition"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 md:px-8 mt-10 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-purple-600 text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-sm text-indigo-600 hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-400 text-center py-10">No products available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

export default HomePage;