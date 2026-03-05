import React from "react";
import { Link } from "react-router";
function HomePage() {
  const categories = ["Accessories", "Laptop", "Phones", "More"];

  const products = [
    { id: 1, name: "Product 1", price: 999, image:"https://via.placeholder.com/300" },
    { id: 2, name: "Product 2", price: 1499, image: "https://via.placeholder.com/300" },
    { id: 3, name: "Product 3", price: 799, image: "https://via.placeholder.com/300" },
    { id: 4, name: "Product 4", price: 1999, image: "https://via.placeholder.com/300" },
  ];

  return (
    <div>
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

      {/* Products */}
      <section className="px-8 mt-8">
        <h2 className="text-purple-600 text-2xl font-bold mb-6">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-52 w-full object-cover rounded-lg"
              />
              <h3 className="mt-3 font-semibold">{product.name}</h3>
              <p className="text-blue-600 font-bold mt-1">
                ₹{product.price}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;