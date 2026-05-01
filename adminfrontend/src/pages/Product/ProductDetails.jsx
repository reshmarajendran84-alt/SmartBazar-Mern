import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../services/productService";
import toast from "react-hot-toast";
import { FiArrowLeft, FiShoppingCart } from "react-icons/fi";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const { addToCart } = useCart();
  const [product, setProduct]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getProductById(id);
        setProduct(data);
        setMainImage(data.images?.[0] ?? null);
      } catch {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] text-gray-400 text-sm">
      Loading product...
    </div>
  );

  if (!product) return (
    <div className="flex items-center justify-center min-h-[60vh] text-red-500 text-sm">
      Product not found
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition mb-6">
        <FiArrowLeft size={14} /> Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8 grid md:grid-cols-2 gap-8">

        {/* Images */}
        <div>
          <div className="w-full aspect-[4/3] rounded-xl border border-gray-100 bg-gray-50 overflow-hidden flex items-center justify-center">
            {mainImage
              ? <img src={mainImage} className="w-full h-full object-cover" alt={product.name} />
              : <span className="text-gray-300 text-sm">No image</span>}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setMainImage(img)}
                  className={`w-14 h-14 rounded-lg border-2 overflow-hidden transition ${
                    mainImage === img ? "border-indigo-500" : "border-gray-100 hover:border-gray-300"
                  }`}>
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Category</span>
            <span className="bg-violet-100 text-violet-800 px-2.5 py-1 rounded-full text-xs font-medium">
              {product.category?.name || "No category"}
            </span>
          </div>

          <p className="text-3xl font-bold text-indigo-600">₹ {product.price}</p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Stock</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
            </span>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>

        
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;