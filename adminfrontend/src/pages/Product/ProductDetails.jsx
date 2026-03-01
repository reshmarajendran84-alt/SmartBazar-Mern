import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../services/productService";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  if (loading) return <p>Loading...</p>;

  if (!product) return <p>Product not found</p>;

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
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-80 object-cover rounded"
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">{product.name}</h2>

          <p className="text-gray-600">
            Category: {product.category?.name || "No category"}
          </p>

          <p className="text-xl text-green-600 font-semibold">
            ₹ {product.price}
          </p>

          <p>Stock: {product.stock}</p>

          <p className="text-gray-700">{product.description}</p>

          <p
            className={`font-semibold ${
              product.isActive ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.isActive ? "Active" : "Inactive"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;