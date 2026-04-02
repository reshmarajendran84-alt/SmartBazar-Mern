import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getProducts } from "../services/productService";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleAdd } = useCart();

  const [product, setProduct]           = useState(null);
  const [mainImage, setMainImage]       = useState(null);
  const [loading, setLoading]           = useState(true);
  const [relatedProducts, setRelated]   = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const { data } = await getProductById(id);
      setProduct(data);
      setMainImage(data.images?.[0] || null);

      // ✅ Fetch real related products by same category
      if (data.category?._id) {
        const rel = await getProducts(1, data.category._id, "", "");
        const others = rel.data.products.filter((p) => p._id !== id).slice(0, 4);
        setRelated(others);
      }
    } catch (err) {
      toast.error("Product not found");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    await handleAdd(product);
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    await handleAdd(product);
    navigate("/cart");
  };

  // ✅ Skeleton while loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="flex-1 bg-gray-200 rounded-xl h-96" />
            <div className="w-full md:w-96 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-24 bg-gray-200 rounded" />
              <div className="flex gap-3">
                <div className="h-12 bg-gray-200 rounded flex-1" />
                <div className="h-12 bg-gray-200 rounded flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Product Section */}
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6 bg-white rounded-2xl shadow-md p-6">

          {/* Thumbnails — horizontal on mobile, vertical on desktop */}
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                onClick={() => setMainImage(img)}
                className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg cursor-pointer border-2 flex-shrink-0 transition
                  ${mainImage === img ? "border-indigo-500" : "border-transparent hover:border-gray-300"}`}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl p-4 min-h-64">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="max-h-96 w-full object-contain rounded-xl"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-xl" />
            )}
          </div>

          {/* Product Info */}
          <div className="w-full md:w-96 space-y-3">

            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>

            <p className="text-yellow-500 text-lg">⭐⭐⭐⭐☆
              <span className="text-gray-400 text-sm ml-2">(4.0)</span>
            </p>

            <p className="text-sm text-gray-500">
              Category:{" "}
              <span className="text-indigo-600 font-medium">
                {product.category?.name || "Uncategorized"}
              </span>
            </p>

            {/* Price block */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-indigo-600">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-gray-400 line-through text-lg">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-green-600 text-sm font-medium">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                  </span>
                </>
              )}
            </div>

            {/* Stock badge */}
            <p className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
              {product.stock > 0 ? `✔ In Stock (${product.stock} left)` : "✖ Out of Stock"}
            </p>

            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300
                           text-white py-3 rounded-xl font-medium transition"
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300
                           text-white py-3 rounded-xl font-medium transition"
              >
                Buy Now
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 md:px-6 pb-10">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/products/${item._id}`)}
                className="bg-white p-4 rounded-xl shadow hover:shadow-md cursor-pointer transition"
              >
                <img
                  src={item.images?.[0] || "https://via.placeholder.com/300"}
                  alt={item.name}
                  className="h-40 w-full object-cover rounded-lg"
                />
                <h3 className="mt-2 font-semibold text-gray-800 text-sm line-clamp-2">
                  {item.name}
                </h3>
                {item.originalPrice && (
                  <p className="text-gray-400 line-through text-xs">₹{item.originalPrice}</p>
                )}
                <p className="text-indigo-600 font-bold">₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default SingleProduct;