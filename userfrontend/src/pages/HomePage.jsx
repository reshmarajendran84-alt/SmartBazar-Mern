import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";

function HomePage() {
  const categories = ["Accessories", "Laptop", "Phones", "More"];

  const { handleAddToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [page] = useState(1);
  const [category] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await getProducts(page, category);
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero Banner */}
      <section className="px-8 mt-6">
        <div className="h-72 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-3xl font-semibold">
          HERO BANNER IMAGE
        </div>
      </section>

      {/* Categories */}
      <section className="px-8 mt-6">
        <div className="flex gap-6 justify-center">
          {categories.map((cat, index) => (
            <Link
              key={index}
              to={`/products?category=${cat}`}
              className="text-purple-600 bg-white px-6 py-2 rounded-full shadow hover:bg-blue-600 hover:text-white transition"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-8 mt-10">

        <h2 className="text-purple-600 text-2xl font-bold mb-6">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}

        </div>

      </section>

    </div>
  );
}

export default HomePage;