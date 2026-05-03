import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../services/productService";
import toast from "react-hot-toast";
import { FiArrowLeft, FiPackage } from "react-icons/fi";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [imgIdx, setImgIdx]       = useState(0);

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

  const selectImage = (img, i) => { setMainImage(img); setImgIdx(i); };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
        <span className="text-sm">Loading product...</span>
      </div>
    </div>
  );

  if (!product) return (
    <div className="flex items-center justify-center min-h-[60vh] text-red-400 text-sm">
      Product not found
    </div>
  );

  const images = product.images || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800
                   bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2
                   rounded-lg transition mb-6 shadow-sm">
        <FiArrowLeft size={14} /> Back to products
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">

          {/* ── Image Panel ── */}
          <div className="bg-gray-50 border-r border-gray-100 p-5 flex flex-col gap-4">

            {/* Main image */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden
                            border border-gray-200 bg-white shadow-inner group">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain transition-all duration-300
                             group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center
                                text-gray-300 gap-2">
                  <FiPackage size={40} />
                  <span className="text-xs">No image</span>
                </div>
              )}

              {/* Image counter badge */}
              {images.length > 1 && (
                <span className="absolute bottom-2 right-2 bg-black/50 text-white
                                 text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {imgIdx + 1} / {images.length}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => selectImage(img, i)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2
                                transition-all duration-200 flex-shrink-0
                                ${mainImage === img
                                  ? "border-indigo-500 shadow-md shadow-indigo-100 scale-105"
                                  : "border-gray-200 hover:border-indigo-300 hover:scale-105 opacity-70 hover:opacity-100"
                                }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`thumb-${i}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info Panel ── */}
          <div className="p-6 sm:p-8 flex flex-col gap-5">

            {/* Name + category */}
            <div>
              <span className="bg-violet-100 text-violet-700 px-2.5 py-1
                               rounded-full text-xs font-medium">
                {product.category?.name || "Uncategorized"}
              </span>
              <h1 className="text-2xl font-bold text-gray-800 mt-2 leading-snug">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-gray-400 font-medium">₹</span>
              <span className="text-4xl font-extrabold text-indigo-600">
                {Number(product.price).toLocaleString("en-IN")}
              </span>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                product.stock > 0 ? "bg-green-500" : "bg-red-500"
              }`} />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Stock</p>
                <p className={`text-sm font-semibold ${
                  product.stock > 0 ? "text-green-700" : "text-red-600"
                }`}>
                  {product.stock > 0 ? `${product.stock} units available` : "Out of stock"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1.5">
                Description
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description || "No description provided."}
              </p>
            </div>

            {/* Meta */}
            <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Product ID</p>
                <p className="text-xs font-mono text-gray-600 mt-1 truncate">{product._id}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Images</p>
                <p className="text-sm font-semibold text-gray-700 mt-1">{images.length} photo{images.length !== 1 ? "s" : ""}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;