import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CategoryForm = ({ onClose, onSubmit, editData }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      await onSubmit(name);
      // onClose();
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-3 sm:px-4 z-50">

      {/* Modal */}
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-5 sm:p-6 space-y-5 sm:space-y-6 
        animate-[fadeIn_.3s_ease] transition-all"
      >
        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {editData ? "Edit Category" : "Add Category"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
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
            className="mt-2 w-full border border-gray-300 px-4 py-2.5 rounded-lg 
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
            outline-none transition text-sm sm:text-base"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border 
            text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-white font-medium transition shadow
            ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading
              ? "Processing..."
              : editData
              ? "Update"
              : "Save"}
          </button>

        </div>
      </form>
    </div>
  );
};

export default CategoryForm;