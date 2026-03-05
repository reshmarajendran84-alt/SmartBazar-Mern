import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const ProductCard = React.memo(({ product }) => {
  const { handleAddToCart } = useCart();

  return (
    <div className="border p-4 rounded shadow">
      <Link to={`/products/${product._id}`}>
        <img
          src={`http://localhost:5000/${product.images?.[0]}`}
          alt={product.name}
          className="h-40 w-full object-cover"
        />

        <h3 className="mt-2 font-semibold">{product.name}</h3>
      </Link>

      <p className="text-blue-600 font-bold mt-1">₹{product.price}</p>

      <button
        onClick={() => handleAddToCart(product)}
        className="bg-indigo-600 text-white px-3 py-1 mt-2 rounded"
      >
        Add To Cart
      </button>
    </div>
  );
});

export default ProductCard;