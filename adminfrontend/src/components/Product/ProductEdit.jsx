import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../../context/ProductContext";
import { useCategory } from "../../context/CategoryContext";

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { products, updateProduct } = useProduct();
  const { categories } = useCategory();

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });

  useEffect(() => {
    const existing = products.find((p) => p._id === id);

    if (existing) {
      setForm({
        name: existing.name,
        price: existing.price,
        stock: existing.stock,
        category: existing.category?._id,
      });
    }
  }, [id, products]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProduct(id, form);
    navigate("/admin/products");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl">

      <h2 className="text-xl font-bold mb-4">Edit Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product name"
          className="w-full border p-2 rounded"
        />

        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border p-2 rounded"
        />

        <input
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full border p-2 rounded"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Category</option>

          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <button className="bg-indigo-600 text-white px-4 py-2 rounded">
          Update Product
        </button>

      </form>
    </div>
  );
};

export default ProductEdit;
