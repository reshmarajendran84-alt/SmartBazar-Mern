import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { addToCart } from "../utils/cart";
import { useCart } from "../context/CartContext";
const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { handleAddToCart } = useCart();
  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    const { data } = await getProductById(id);
    setProduct(data);
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="p-6 grid grid-cols-2 gap-6">

      {/* Images */}
      <div>
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-96 object-cover rounded"
        />
      </div>

      {/* Details */}
      <div>
        <h1 className="text-2xl font-bold">
          {product.name}
        </h1>

        <p className="text-gray-600 mt-2">
          Category: {product.category?.name}
        </p>

        <p className="text-xl font-semibold mt-4">
          ₹{product.price}
        </p>

        <p className="mt-4">
          {product.description}
        </p>

        <button
          onClick={()=>handleAddToCart(product)}
          className="bg-indigo-600 text-white px-6 py-2 mt-6 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default SingleProduct;