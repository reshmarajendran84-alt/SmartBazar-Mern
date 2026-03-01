import { useState } from "react";

const CategoryForm = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
      if (!name.trim()) return alert("Category name required");

    onSubmit(name);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded w-96 space-y-4"
      >
        <h2 className="text-lg font-bold">Add Category</h2>

        <input
          className="w-full border p-2"
          placeholder="Category name"
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button className="bg-indigo-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;