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

  const [images, setImages] = useState([]); // multiple images
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
      setCategories([]);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Handle Image Selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const imagePreviews = files.map((file) =>
      URL.createObjectURL(file)
    );
    setPreview(imagePreviews);
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("category", form.category);
    formData.append("description", form.description);

    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      if (isEdit) {
        await updateProduct(editData._id, formData);
        toast.success("Product updated");
      } else {
        await createProduct(formData);
        toast.success("Product created");
      }

      refresh();
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
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

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="input"
          placeholder="Name"
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="input"
          placeholder="Price"
        />

        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          className="input"
          placeholder="Stock"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="input"
        >
          <option value="">Select Category</option>
          {categories?.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="input"
          placeholder="Description"
        />

        {/* ✅ File Input */}
        <input
          type="file"
          multiple
          onChange={handleImageChange}
        />

        {/* ✅ Preview Images */}
        {preview.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {preview.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        )}

        <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full">
          {isEdit ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;