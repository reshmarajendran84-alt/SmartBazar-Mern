import { useState } from "react";

const CategoryForm = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
      if (!name.trim()) return alert("Category name required");

    onSubmit(name);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">

  <form className="bg-white w-full max-w-md p-6 rounded-2xl space-y-4 shadow-lg">

    <h2 className="text-xl font-bold">Add Category</h2>

    <input
      className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      placeholder="Category name"
    />

    <div className="flex justify-end gap-3">
      <button type="button" onClick={onClose} className="text-gray-500">
        Cancel
      </button>

      <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg">
        Save
      </button>
    </div>

  </form>
  <div className="text-center text-xs text-gray-500 py-4">
  © {new Date().getFullYear()} SmartBazar Admin Panel
</div>
</div>
  );
};

export default CategoryForm;