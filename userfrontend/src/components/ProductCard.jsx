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
      await handleAdd(product);   // ✅ toast already fires inside handleAdd
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden flex flex-col">

      <Link to={`/products/${product._id}`} className="overflow-hidden">
        <img
          src={product.images?.[0] || "/no-image.png"}
          alt={product.name}
          className="w-full h-48 sm:h-52 md:h-56 object-cover hover:scale-105 transition duration-300"
        />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 hover:text-indigo-600 transition">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-2">
          <p className="text-indigo-600 text-xl font-bold">₹{product.price}</p>
          {product.originalPrice && (
            <p className="text-gray-400 line-through text-sm">₹{product.originalPrice}</p>
          )}
        </div>

        <p className="text-sm mt-1">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          }`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </p>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || adding}
          className="mt-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400
                     text-white py-2 rounded-lg transition font-medium"
        >
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
});

export default ProductCard;