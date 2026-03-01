import { useEffect, useState, useCallback } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../../services/categoryService";

import CategoryForm from "./CategoryForm";
import Table from "../../components/Table";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getCategories();
      console.log("API CATEGORY RESPONSE:", data);
    setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (err) {
      console.log(err.response?.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleCreate = async (name) => {
        console.log("categoryName",name);
await createCategory({name});
    setShowForm(false);
    loadCategories();
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this category?")) {
      await deleteCategory(id);
      loadCategories();
    }
  };

  const columns = [
    { key: "name", label: "Category Name" },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <button
          onClick={() => handleDelete(item._id)}
          className="text-red-500"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div>

      <div className="flex justify-between mb-5">
        <h2 className="text-xl font-bold">Categories</h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          + Add Category
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table data={categories} columns={columns} />
      )}

      {showForm && (
        <CategoryForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
};

export default CategoryList;