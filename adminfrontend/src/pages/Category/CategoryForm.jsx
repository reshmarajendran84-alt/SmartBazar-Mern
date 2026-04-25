import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const CategoryForm = ({ onClose, onSubmit, editData }) => {
  const [name, setName]       = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef              = useRef(null);

  useEffect(() => {
    setName(editData?.name ?? "");
    setTimeout(() => inputRef.current?.focus(), 60);
  }, [editData]);

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!name.trim()) return toast.error("Category name is required");

    try {
      setLoading(true);
      await onSubmit(name.trim());
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-xl p-6">

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-base font-semibold text-gray-800">
            {editData ? "Edit category" : "Add category"}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {editData
              ? "Update your category information"
              : "Create a new product category"}
          </p>
        </div>

        {/* Field */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            Category name
          </label>
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="e.g. Electronics"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm 
            text-gray-800 placeholder-gray-400 outline-none 
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2.5 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-gray-500 bg-gray-50 
            border border-gray-200 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white 
            bg-indigo-600 hover:bg-indigo-700 transition 
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : editData ? "Update" : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CategoryForm;