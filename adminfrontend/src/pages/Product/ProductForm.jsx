import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import toast from "react-hot-toast";

const ProductForm = ({ onClose, refresh, editData }) => {
  const isEdit = !!editData;

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
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

      setPreview(editData.images || []);
    }
  }, [editData]);

  const loadCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
      console.log("Files selected:", files.length); // ← add this
  console.log("Files:", files);                  // ← add this

    // setImages(files);
  if (files.length > 5) {
    toast.error("Maximum 5 images allowed");
    return;
  }
  setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  console.log("images state:", images);       // ← add this
  console.log("images count:", images.length); // ← add this

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("category", form.category);
    formData.append("description", form.description);

    images.forEach((file) => {
      formData.append("images", file);
          console.log("appending image:", file.name); // ← add this

    });
  const toastId = toast.loading("Submitting...");

    try {
      if (isEdit) {
        await updateProduct(editData._id, formData);
      toast.success("Product Updated", { id: toastId });
      } else {
        await createProduct(formData); // calls productSevice.js
      toast.success("Product Created", { id: toastId });
      }

      refresh();
      onClose();
    } catch (error) {
    toast.error("Something went wrong", { id: toastId });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 space-y-5"
      >

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {isEdit ? "Update Product" : "Add Product"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* Form Grid */}
        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Select Category</option>

            {categories?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}

          </select>

        </div>

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Product Description"
          rows="3"
          className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* Image Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="cursor-pointer"
          />

          <p className="text-sm text-gray-500 mt-2">
            Upload product images
          </p>

        </div>

        {/* Image Preview */}
        {preview.length > 0 && (
          <div className="flex gap-3 flex-wrap">

            {preview.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="preview"
                className="w-20 h-20 object-cover rounded-lg border"
              />
            ))}

          </div>
        )}

        {/* Submit */}
        <button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
        >
          {isEdit ? "Update Product" : "Add Product"}
        </button>

      </form>
    </div>
  );
};

export default ProductForm;