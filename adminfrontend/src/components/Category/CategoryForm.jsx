import { useState, useEffect } from "react";
import { useCategory } from "../../context/CategoryContext";

const CategoryForm = () => {
  const { addCategory, updateCategory, editing } = useCategory();

  const [name, setName] = useState("");

  useEffect(() => {
    if (editing) setName(editing.name);
    else setName("");
  }, [editing]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    if (editing) {
      updateCategory(editing._id, { name });
    } else {
      addCategory({ name });
    }

    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">

      <input
        className="border p-2 rounded w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter category name"
      />

      <button className="bg-indigo-600 text-white px-4 py-2 rounded">
        {editing ? "Update" : "Add"}
      </button>

    </form>
  );
};
export default CategoryForm;
