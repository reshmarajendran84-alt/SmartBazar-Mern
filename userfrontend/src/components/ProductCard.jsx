import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = React.memo(({ product }) => {
  const { handleAdd } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (product.stock === 0) return;
    try {
      setAdding(true);
      await handleAdd(product);   
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl shadow-card hover:shadow-hover transition duration-300 overflow-hidden flex flex-col">

  <Link to={`/products/${product._id}`} className="relative overflow-hidden">
    <img
      src={product.images?.[0] || "/no-image.png"}
      alt={product.name}
      className="w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition duration-300"
    />

    {/* Discount badge */}
    {product.originalPrice && (
      <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md">
        Save ₹{product.originalPrice - product.price}
      </span>
    )}
  </Link>

  <div className="p-4 flex flex-col flex-grow">

    <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-indigo-600">
      {product.name}
    </h3>

    <div className="flex items-center gap-2 mt-2">
      <p className="text-lg font-bold text-indigo-600">₹{product.price}</p>
      {product.originalPrice && (
        <p className="text-gray-400 line-through text-sm">
          ₹{product.originalPrice}
        </p>
      )}
    </div>

    <span className={`mt-2 text-xs px-2 py-1 rounded-full w-fit ${
      product.stock > 0
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-600"
    }`}>
      {product.stock > 0 ? "In Stock" : "Out of Stock"}
    </span>

    <button
      onClick={handleAddToCart}
      disabled={product.stock === 0 || adding}
      className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm font-semibold transition"
    >
      {adding ? "Adding..." : "Add to Cart"}
    </button>

  </div>
</div>
  );
});

export default ProductCard;