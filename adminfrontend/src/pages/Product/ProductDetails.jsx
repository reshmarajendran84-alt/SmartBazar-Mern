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
  const [mainImage, setMainImage] = useState(null);

  // Load product
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

  // Set default main image
  useEffect(() => {
    if (product?.images?.length > 0) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  // Loading state
  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">
        Loading product...
      </p>
    );
  }

  // No product
  if (!product) {
    return (
      <p className="text-center mt-10 text-red-500 text-lg">
        Product not found
      </p>
    );
  }

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

        {/* LEFT: Product Images */}
        <div className="flex justify-center items-center">
          <div className="flex flex-col gap-2">

            {/* Main Image */}
            <img
              src={mainImage || "/placeholder.png"}
              className="w-full max-w-md h-80 object-cover rounded-xl"
              alt={product.name}
            />

            {/* Thumbnails */}
            <div className="flex gap-2 mt-2 flex-wrap">
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 object-cover rounded-lg border-2 cursor-pointer ${
                    mainImage === img
                      ? "border-indigo-600"
                      : "border-gray-200"
                  }`}
                  alt={`thumb-${i}`}
                />
              ))}
            </div>

          </div>
        </div>

        {/* RIGHT: Product Details */}
        <div className="space-y-4">

          {/* Name */}
          <h2 className="text-3xl font-bold text-gray-800">
            {product.name}
          </h2>

          {/* Category */}
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
              className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                product.stock > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {product.stock > 0
                ? `${product.stock} Available`
                : "Out of stock"}
            </span>
          </p>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">

            <button
              onClick={() => {
                addToCart(product);
                toast.success("Added to cart");
              }}
              disabled={product.stock === 0}
              className={`px-6 py-2 rounded-lg text-white font-medium transition ${
                product.stock > 0
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Add to Cart
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Go to Cart
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetails;