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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* ─── HERO SECTION ─── */}
      <section className="px-4 md:px-8 mt-6">
        <div className="relative h-52 sm:h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">

          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
              SmartBazar
            </h1>
            <p className="text-sm md:text-lg opacity-90 mb-5">
              Discover amazing deals on top products 🚀
            </p>

            <Link
              to="/products"
              className="bg-white text-indigo-600 font-semibold px-6 py-2 rounded-full shadow hover:scale-105 transition"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="px-4 md:px-8 mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Shop by Category
        </h2>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <Link
            to="/products"
            className="whitespace-nowrap px-5 py-2 rounded-full bg-indigo-600 text-white text-sm shadow"
          >
            All
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}`}
              className="whitespace-nowrap px-5 py-2 rounded-full bg-white text-gray-700 text-sm shadow hover:bg-indigo-600 hover:text-white transition"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="px-4 md:px-8 mt-10 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="text-indigo-600 text-sm font-medium hover:underline"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-400 text-center py-10">
            No products available
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.slice(0, 8).map((product) => (
              <div className="hover:scale-[1.02] transition" key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── PROMO SECTION ─── */}
      <section className="px-4 md:px-8 pb-12">
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Special Offer 🎉
            </h3>
            <p className="text-sm text-gray-500">
              Get up to 50% off on selected items
            </p>
          </div>
          <Link
            to="/products"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Explore Deals
          </Link>
        </div>
      </section>

    </div>
  );
}

export default HomePage;