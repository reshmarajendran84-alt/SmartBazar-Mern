import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSingleProduct } from "../services/productService";
import { useCart } from "../context/CartContext";

const SingleProduct = () => {

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const res = await fetchSingleProduct(id);
      setProduct(res.data.product);
    } catch (err) {
      console.log(err);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6 grid grid-cols-2 gap-6">

      <img
        src={product.images[0]}
        className="w-full h-96 object-cover rounded"
      />

      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-xl text-green-600">₹{product.price}</p>

        <p className="my-4">{product.description}</p>

        <button
          onClick={() => addToCart(product)}
          className="bg-indigo-600 text-white px-6 py-2 rounded"
        >
          Add To Cart
        </button>
      </div>

    </div>
  );
};

export default SingleProduct;