import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../../services/productService";
import { getCategories } from "../../services/categoryService";

const ProductForm = ({ onClose, refresh, editData }) => {
  const isEdit = !!editData;

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        price: editData.price,
        category: editData.category?._id || "",
        stock: editData.stock,
        description: editData.description,
      });
    
      setPreview(editData?.images?.[0] || "");
    }
  }, [editData]);

  const loadCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setCategories([]);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("name", form.name);
  formData.append("price", form.price);
  formData.append("stock", form.stock);
  formData.append("category", form.category);
  formData.append("description", form.description);

  if (image) {
    formData.append("images", image);
  }

  if (isEdit) {
    await updateProduct(editData._id, formData);
  } else {
    await createProduct(formData);
  }

  refresh();
  onClose();
};
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded w-[500px] space-y-3"
      >
        <h2 className="text-lg font-bold">
          {isEdit ? "Update Product" : "Add Product"}
        </h2>

        <input name="name" value={form.name} onChange={handleChange} className="input" placeholder="Name" />
        <input name="price" value={form.price} onChange={handleChange} className="input" placeholder="Price" />
        <input name="stock" value={form.stock} onChange={handleChange} className="input" placeholder="Stock" />

        <select name="category" value={form.category} onChange={handleChange} className="input">
          <option value="">Select Category</option>
          {categories?.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <textarea name="description" value={form.description} onChange={handleChange} className="input" placeholder="Description" />

       {preview && (
  <img
    src={
      preview.startsWith("http")
        ? preview
        : `http://localhost:5000/${preview}`
    }
    className="w-20 h-20 object-cover"
  />
)}

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose}>Cancel</button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;