import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../services/productService";
import { useCart } from "../../context/CartContext";

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!product) return <p className="p-4">Product not found</p>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 px-3 py-1 rounded"
      >
        ← Back
      </button>

      <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded shadow">

        {/* IMAGE */}
        <div>
          <img
            src={`http://localhost:5000/${product.images?.[0]}`}
            alt={product.name}
            className="w-full max-w-md h-80 object-cover mx-auto rounded-xl"
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold mt-4">{product.name}</h2>

          <p className="text-gray-600">
            Category: {product.category?.name || "No category"}
          </p>

          <p className="text-lg text-gray-700 mt-2">₹ {product.price}</p>

          <p>Stock: {product.stock}</p>

          <p className="text-gray-700">{product.description}</p>

          {/* <button
            className="bg-purple-700 text-white px-6 py-2 rounded mt-5"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button> */}
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;