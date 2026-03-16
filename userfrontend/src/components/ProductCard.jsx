import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const ProductCard = React.memo(({ product }) => {
  const { handleAddToCart } = useCart();

  return (
    <div className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden flex flex-col">

      {/* Product Image */}
      <Link to={`/products/${product._id}`} className="overflow-hidden">
        <img
          src={product.images?.[0] || "/no-image.png"}
          alt={product.name}
          className="w-full h-48 sm:h-52 md:h-56 object-cover hover:scale-105 transition duration-300"
        />
      </Link>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow">

        {/* Product Name */}
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 hover:text-indigo-600 transition">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <p className="text-indigo-600 text-xl font-bold mt-2">
          ₹{product.price}
        </p>

        {/* Stock */}
        <p className="text-sm mt-1">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              product.stock > 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </p>

        {/* Button */}
        <button
          onClick={() => handleAddToCart(product)}
          disabled={product.stock === 0}
          className="mt-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition"
        >
          Add To Cart
        </button>

      </div>
    </div>
  );
});

export default ProductCard;