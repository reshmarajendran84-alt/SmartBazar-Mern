import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import BannerCarousel from "../components/BannerCarousel";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

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

      {/* ─── BANNER CAROUSEL ─── */}
      <section className="px-4 md:px-8 mt-6">
        <BannerCarousel />
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
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
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
          <p className="text-gray-400 text-center py-10">No products available</p>
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
        <div className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 rounded-2xl shadow p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">Special Offer 🎉</h3>
            <p className="text-sm text-white/80">
              Get up to 50% off on selected items
            </p>
          </div>
          <Link
            to="/products"
            className="bg-white text-indigo-600 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Explore Deals
          </Link>
        </div>
      </section>

    </div>
  );
}

export default HomePage;