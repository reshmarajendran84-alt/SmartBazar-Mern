import { useEffect, useState, useCallback } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../../services/categoryService";

import CategoryForm from "./CategoryForm";
import Table from "../../components/Table";
import PageContainer from "../../components/PageContainer"; // ✅ IMPORT

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getCategories();

      setCategories(
        Array.isArray(data) ? data : data.categories || []
      );
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
    await createCategory({ name });
    setShowForm(false);
    loadCategories();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
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
          className="text-red-500 hover:underline"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <>
      <PageContainer
        title="Categories"
        action={
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            + Add Category
          </button>
        }
      >
        {loading ? (
          <p className="text-center text-gray-500 py-6">
            Loading categories...
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table data={categories} columns={columns} />
          </div>
        )}
      </PageContainer>

      {showForm && (
        <CategoryForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
        />
      )}
    </>
  );
};

export default CategoryList;