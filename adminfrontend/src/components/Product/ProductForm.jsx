import { useEffect, useState } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";

const ProductForm = ({ editing, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });

  const [categories, setCategories] = useState([]);

useEffect(()=>{
loadCategories();
if(editing){
    setForm({
        name:editing.name,
        price:editing.price,
        stock:editing.stock,
        category:editing.category?._id || "",
    });
}
},[editing]);

  const loadCategories = async () => {
  try {
    const res = await api.get("/admin/category");
setCategories(res.data);
  } catch {
    toast.error("Failed to load categories");
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.category) {
    return toast.error("Please select a category");
  }

  try {
    if (editing) {
      await api.put(`/admin/product/${editing._id}`, form);
      toast.success("Product updated");
    } else {
      await api.post("/admin/product", form);
      toast.success("Product added");
    }

    onSuccess();
  } catch (err) {
    toast.error(err.response?.data?.message || "Save failed");
  }
};

  return (
    <form onSubmit={handleSubmit} className="border p-4 mb-4 rounded">
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 w-full mb-2"
      />

      <input
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        className="border p-2 w-full mb-2"
      />

      <input
        placeholder="Stock"
        value={form.stock}
        onChange={(e) => setForm({ ...form, stock: e.target.value })}
        className="border p-2 w-full mb-2"
      />

      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="border p-2 w-full mb-2"
      >
        <option value="">Select Category</option>
        {categories?.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        {editing ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;
