import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import toast from "react-hot-toast";
import { FiX, FiUpload } from "react-icons/fi";

const ProductForm = ({ onClose, refresh, editData }) => {
  const isEdit = !!editData;
  const [form, setForm] = useState({ name: "", price: "", category: "", stock: "", description: "" });
  const [images, setImages]     = useState([]);
  const [preview, setPreview]   = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => { loadCategories(); }, []);

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name, price: editData.price,
        category: editData.category?._id || "",
        stock: editData.stock, description: editData.description,
      });
      setPreview(editData.images || []);
    }
  }, [editData]);

  const loadCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch {}
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) return toast.error("Max 5 images allowed");
    setImages(files);
    setPreview(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    images.forEach(f => fd.append("images", f));
    const toastId = toast.loading("Saving...");
    try {
      isEdit ? await updateProduct(editData._id, fd) : await createProduct(fd);
      toast.success(isEdit ? "Product updated" : "Product created", { id: toastId });
      refresh();
      onClose();
    } catch {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";

  return (
    <form onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 shadow-xl w-full max-w-xl p-5 sm:p-6 space-y-4">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">
            {isEdit ? "Edit product" : "Add product"}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {isEdit ? "Update product details" : "Fill in details to create a product"}
          </p>
        </div>
        <button type="button" onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
          <FiX size={15} />
        </button>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { name: "name", placeholder: "Product name", type: "text" },
          { name: "price", placeholder: "Price (₹)", type: "number" },
          { name: "stock", placeholder: "Stock quantity", type: "number" },
        ].map(f => (
          <div key={f.name}>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              {f.placeholder}
            </label>
            <input name={f.name} type={f.type} value={form[f.name]}
              onChange={handleChange} placeholder={f.placeholder} className={inputCls} />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            Category
          </label>
          <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
            <option value="">Select category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
          Description
        </label>
        <textarea name="description" value={form.description} onChange={handleChange}
          placeholder="Describe the product..." rows={3} className={`${inputCls} resize-none`} />
      </div>

      {/* Upload */}
      <div className="border border-dashed border-gray-200 rounded-xl p-4 text-center">
        <FiUpload className="mx-auto mb-2 text-gray-300" size={20} />
        <input type="file" multiple accept="image/*" onChange={handleImageChange}
          className="text-xs text-gray-500 cursor-pointer" />
        <p className="text-xs text-gray-400 mt-1.5">Up to 5 images · JPG, PNG, WEBP</p>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {preview.map((img, i) => (
            <img key={i} src={img} className="w-14 h-14 object-cover rounded-lg border border-gray-100" alt="" />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2.5 pt-1">
        <button type="button" onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm text-gray-500 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition">
          Cancel
        </button>
        <button type="submit"
          className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition">
          {isEdit ? "Update product" : "Add product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;