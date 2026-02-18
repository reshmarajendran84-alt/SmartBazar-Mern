import { useState } from "react";
import { useProduct } from "../../../context/ProductContext";
import { toast } from "react-toastify";

const ProductForm = () => {

  const { createProduct, categories } = useProduct();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProduct(form);

      toast.success("Product created 🚀");

      setForm({
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
      });

    } catch {
      toast.error("Failed ❌");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow space-y-4 max-w-xl"
    >

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

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Category</option>

        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}

      </select>

      <input
        name="stock"
        value={form.stock}
        onChange={handleChange}
        placeholder="Stock"
        className="w-full border p-2 rounded"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full border p-2 rounded"
      />

      <button className="bg-indigo-600 text-white px-4 py-2 rounded">
        Create Product
      </button>

    </form>
  );
};

export default ProductForm;
