import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getProducts } from "../services/productService";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import api from "../utils/api";

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
  const [checkingOrder, setCheckingOrder] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (isLoggedIn && product?._id) {
      fetchDeliveredOrderForProduct();
    }
  }, [isLoggedIn, product?._id]);

  const fetchDeliveredOrderForProduct = async () => {
    if (!product?._id) return;
    
    setCheckingOrder(true);
    try {
      // Get user's orders
      const { data } = await api.get(`/order/my-orders`);
      console.log("User orders:", data);
      
      // Find delivered order containing this product
      const deliveredOrder = data.orders?.find(order =>
  order.status === "Delivered" &&
  order.cartItems?.some(item => {
    const itemProductId = item.productId?._id || item.productId; // handle both object and string
    return itemProductId === product._id;
  })
);
      
      if (deliveredOrder) {
        setDeliveredOrderId(deliveredOrder._id);
        console.log("Found delivered order for review:", deliveredOrder._id);
      } else {
        console.log("No delivered order found for this product");
      }
    } catch (err) {
      console.log("Error fetching orders:", err);
    } finally {
      setCheckingOrder(false);
    }
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      setDeliveredOrderId(null);
      const { data } = await getProductById(id);
      setProduct(data);
      setMainImage(data.images?.[0]);

      if (data.category?._id) {
        const rel = await getProducts({ page: 1, category: data.category._id });
        setRelated(rel.data.products.filter((p) => p._id !== id).slice(0, 4));
      }
    } catch (error) {
      console.error("Load product error:", error);
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

  const handleBuyNow = () => {
  navigate("/checkout", {
    state: {
      buyNowItem: {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        quantity: 1,
        stock: product.stock,
      },
    },
  });
};
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
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
            <div className="flex md:flex-col gap-2 overflow-x-auto">
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border-2
                  ${mainImage === img ? "border-indigo-500" : "border-gray-200"}`}
                  alt={`Thumbnail ${i + 1}`}
                />
              ))}
            </div>
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
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-sm text-gray-500">
            Category:{" "}
            <span className="text-indigo-600 font-medium">
              {product.category?.name}
            </span>
          </p>

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
                  )}
                  % OFF
                </span>
              </>
            )}
          </div>

          <p className={`text-sm font-medium ${
            product.stock > 0 ? "text-green-600" : "text-red-500"
          }`}>
            {product.stock > 0 ? "✔ In Stock" : "Out of Stock"}
          </p>

          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* ─── REVIEWS ─── */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 bg-white rounded-2xl shadow mt-4">
        <h2 className="text-lg font-bold mb-4">Ratings & Reviews</h2>

        {checkingOrder && (
          <p className="text-sm text-gray-400 mb-4">Checking order status...</p>
        )}

        {isLoggedIn && deliveredOrderId && !checkingOrder && (
          <ReviewForm productId={product._id} orderId={deliveredOrderId} />
        )}

        {isLoggedIn && !deliveredOrderId && !checkingOrder && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-700">
Top Reviews             </p>
          </div>
        )}

        {!isLoggedIn && (
          <p className="text-sm text-gray-500 mb-4">
            <span
              onClick={() => navigate("/auth/login")}
              className="text-indigo-600 cursor-pointer font-semibold hover:underline"
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
            {relatedProducts.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/products/${item._id}`)}
                className="bg-white p-3 rounded-xl shadow hover:shadow-md cursor-pointer transition"
              >
                <img
                  src={item.images?.[0]}
                  className="h-40 w-full object-cover rounded"
                  alt={item.name}
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