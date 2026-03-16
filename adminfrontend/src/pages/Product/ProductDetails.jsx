import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProduct = async () => {
    try {
      const { data } = await getProductById(id);
      setProduct(data);
    } catch (err) {
      console.log(err);
            toast.error("Failed to load product");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">
        Loading product...
      </p>
    );

  if (!product)
    return (
      <p className="text-center mt-10 text-red-500 text-lg">
        Product not found
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition"
      >
        ← Back
      </button>

      {/* Product Card */}
      <div className="grid md:grid-cols-2 gap-10 bg-white p-6 md:p-10 rounded-2xl shadow-lg">

        {/* Product Image */}
        <div className="flex justify-center items-center">
          <img
src={product.images?.[0]}
            alt={product.name}
            className="w-full max-w-md h-80 object-cover rounded-xl shadow-md hover:scale-105 transition"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-4">

          <h2 className="text-3xl font-bold text-gray-800">
            {product.name}
          </h2>

          <p className="text-gray-500 text-sm">
            Category:{" "}
            <span className="font-medium text-purple-600">
              {product.category?.name || "No category"}
            </span>
          </p>

          {/* Price */}
          <p className="text-3xl font-bold text-green-600">
            ₹ {product.price}
          </p>

          {/* Stock */}
          <p>
            Stock:
            <span
              className={`ml-2 px-2 py-1 rounded text-xs font-medium
              ${
                product.stock > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {product.stock > 0 ? `${product.stock} Available` : "Out of stock"}
            </span>
          </p>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>

        </div>

      </div>
    </div>
  );
};

export default ProductDetails;