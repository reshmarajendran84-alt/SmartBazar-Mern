import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import {toast} from "react-toastify";
const SingleProduct = () => {
  const { id } = useParams();
  const { handleAddToCart } = useCart();

  const [product, setProduct] = useState(null);
const [mainImage, setMainImage] = useState(null);
  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const { data } = await getProductById(id);
      setProduct(data);

      if (data.images && data.images.length > 0) {
        setMainImage(data.images[0]);
      }
    } catch (err) {
      toast.error("product not found");
      console.log(err);
    }
  };

  const relatedProducts = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    name: `Product ${i + 1}`,
    price: 899,
image: "https://dummyimage.com/300x300/cccccc/000000"  }));

  if (!product) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">

      
      {/* Product Section */}
      <div className="p-6 flex gap-8">

        {/* Thumbnails */}
        <div className="flex flex-col gap-3">
{product.images?.length > 0 &&
 product.images.map((img, i) => (
              <img
              key={i}
              src={img}
              alt=""
              className="w-20 h-20 object-cover border cursor-pointer"
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>

        {/* Large Image */}
        <div className="flex-1">
        {mainImage && (
  <img
    src={mainImage}
    alt={product.name}
    className="w-full max-w-lg object-cover rounded"
  />
)}
        </div>

        {/* Product Info */}
        <div className="w-96">

          <h1 className="text-2xl font-bold">
            {product.name}
          </h1>

          <p className="text-yellow-500 mt-2">
            ⭐⭐⭐⭐☆
          </p>

          <p className="text-gray-600 mt-2">
            Category: {product.category?.name}
          </p>

          <p className="text-xl text-blue-600 font-bold mt-3">
            ₹{product.price}
          </p>

          <p className="mt-2 text-green-600">
            Stock: {product.stock}
          </p>

          <p className="mt-4 text-gray-600">
            {product.description}
          </p>

          <div className="flex gap-4 mt-6">

            <button
              onClick={() => handleAddToCart(product)}
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
              Add To Cart
            </button>

            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Buy Now
            </button>

          </div>

        </div>
      </div>

      {/* Related Products */}
      <div className="p-6">

        <h2 className="text-xl font-bold mb-4">
          Related Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

          {relatedProducts.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded shadow"
            >
              <img
                src={item.image}
                alt=""
                className="h-40 w-full object-cover rounded"
              />

              <h3 className="mt-2 font-semibold">
                {item.name}
              </h3>

              <p className="text-blue-600 font-bold">
                ₹{item.price}
              </p>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
};

export default SingleProduct;
