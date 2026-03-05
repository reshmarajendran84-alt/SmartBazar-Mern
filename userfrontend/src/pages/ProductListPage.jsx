import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await getProducts();
    setProducts(data.products);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 shadow">

        <h2 className="font-bold mb-4">Categories</h2>

        <div className="space-y-2">
          <label className="flex gap-2">
            <input type="checkbox" />
            Electronics
          </label>

          <label className="flex gap-2">
            <input type="checkbox" />
            Fashion
          </label>

          <label className="flex gap-2">
            <input type="checkbox" />
            Shoes
          </label>
        </div>

        <h2 className="font-bold mt-6 mb-2">Price</h2>

        <input type="range" min="0" max="5000" className="w-full" />

      </aside>

      {/* Products */}
      <main className="flex-1 p-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}

        </div>

      </main>

    </div>
  );
};

export default ProductListPage;