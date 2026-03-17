import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CategoryForm = ({ onClose, onSubmit, editData }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editData) {
      setName(editData.name);
    } else {
      setName("");
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("Category name required");
    }

    try {
      // await the async onSubmit function
      await onSubmit(name);

      toast.success(editData ? "Category updated!" : "Category created!");
      onClose(); // close modal after success
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-6 animate-fadeIn"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {editData ? "Edit Category" : "Add Category"}
          </h2>
          <p className="text-sm text-gray-500">
            {editData
              ? "Update your category information"
              : "Create a new product category"}
          </p>
        </div>

        {/* Input */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Category Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            className="mt-2 w-full border border-gray-300 px-4 py-2 rounded-lg 
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow"
          >
            {editData ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;