import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getProducts } from "../services/productService";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleAdd } = useCart();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelated] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [deliveredOrderId, setDeliveredOrderId] = useState(null);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const { data } = await getProductById(id);
      setProduct(data);
      setMainImage(data.images?.[0]);

      if (data.category?._id) {
        const rel = await getProducts(1, data.category._id);
        setRelated(rel.data.products.filter(p => p._id !== id).slice(0, 4));
      }
    } catch {
      toast.error("Product not found");
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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* ─── MAIN PRODUCT ─── */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 grid lg:grid-cols-2 gap-8">

        {/* IMAGE SECTION */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="flex gap-3 flex-col md:flex-row">

            {/* Thumbnails */}
            <div className="flex md:flex-col gap-2 overflow-x-auto">
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border-2 
                  ${mainImage === img ? "border-indigo-500" : "border-gray-200"}`}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={mainImage}
                alt={product.name}
                className="max-h-[400px] object-contain"
              />
            </div>
          </div>
        </div>

        {/* PRODUCT DETAILS */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">

          <h1 className="text-2xl font-bold text-gray-800">
            {product.name}
          </h1>

          <p className="text-sm text-gray-500">
            Category: <span className="text-indigo-600 font-medium">
              {product.category?.name}
            </span>
          </p>

          {/* PRICE */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-indigo-600">
              ₹{product.price}
            </span>

            {product.originalPrice && (
              <>
                <span className="line-through text-gray-400">
                  ₹{product.originalPrice}
                </span>
                <span className="text-green-600 text-sm font-semibold">
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) * 100
                  )}% OFF
                </span>
              </>
            )}
          </div>

          {/* STOCK */}
          <p className={`text-sm font-medium ${
            product.stock > 0 ? "text-green-600" : "text-red-500"
          }`}>
            {product.stock > 0 ? "✔ In Stock" : "Out of Stock"}
          </p>

          {/* DESCRIPTION */}
          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
            >
              Buy Now
            </button>
          </div>

        </div>
      </div>

      {/* ─── REVIEWS ─── */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 bg-white rounded-2xl shadow mt-4">
        <h2 className="text-lg font-bold mb-4">Ratings & Reviews</h2>

        {isLoggedIn && deliveredOrderId && (
          <ReviewForm productId={product._id} orderId={deliveredOrderId} />
        )}

        {!isLoggedIn && (
          <p className="text-sm text-gray-500">
            <span
              onClick={() => navigate("/auth/login")}
              className="text-indigo-600 cursor-pointer font-semibold"
            >
              Login
            </span>{" "}
            to write a review
          </p>
        )}

        <ReviewList productId={product._id} />
      </div>

      {/* ─── RELATED PRODUCTS ─── */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <h2 className="text-xl font-bold mb-4">Related Products</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(item => (
              <div
                key={item._id}
                onClick={() => navigate(`/products/${item._id}`)}
                className="bg-white p-3 rounded-xl shadow hover:shadow-md cursor-pointer"
              >
                <img
                  src={item.images?.[0]}
                  className="h-40 w-full object-cover rounded"
                />
                <h3 className="text-sm font-semibold mt-2 line-clamp-2">
                  {item.name}
                </h3>
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