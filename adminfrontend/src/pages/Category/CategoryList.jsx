import { useEffect, useState, useCallback } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../services/categoryService";

import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import CategoryForm from "./CategoryForm";
import Table from "../../components/Table";
import PageContainer from "../../components/PageContainer";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getCategories();
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
    try {
      await createCategory({ name });
      toast.success("Category added successfully");
      setShowForm(false);
      loadCategories();
    } catch {
      toast.error("Failed to add category");
    }
  };

  const handleUpdate = async (name) => {
    try {
      await updateCategory(editData._id, { name });
      toast.success("Category Updated");
      setShowForm(false);
      setEditData(null);
      loadCategories();
    } catch {
      toast.error("Update Failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      try {
        await deleteCategory(id);
        toast.success("Category deleted");
        loadCategories();
      } catch {
        toast.error("Delete Failed");
      }
    }
  };

  const columns = [
    {
      key: "name",
      label: "Category Name",
      render: (item) => (
        <span className="font-medium text-gray-700">{item.name}</span>
      ),
    },

    {
      key: "isActive",
      label: "Status",
      render: (item) => {
        // const statusActive = item.isActive && item.productCount > 0;
const statusActive = item.isActive && item.productCount > 0;

        return (
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full
              ${
                statusActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
          >
            {statusActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },

    {
      key: "stock",
      label: "Total Products",
      render: (item) => (
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
          {item.productCount || 0}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex items-center gap-4">

          <button
            onClick={() => {
              setEditData(item);
              setShowForm(true);
            }}
            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
          >
            <FiEdit size={16} />
          </button>

          <button
            onClick={() => handleDelete(item._id)}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
          >
            <FiTrash2 size={16} />
          </button>

        </div>
      ),
    },
  ];

  return (
    <>
      <PageContainer
        title="Categories"
        action={
          <button
            onClick={() => {
              setEditData(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow"
          >
            <FiPlus />
            Add Category
          </button>
        }
      >
        {loading ? (
          <p className="text-center text-gray-500 py-8">
            Loading categories...
          </p>
        ) : (
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <Table data={categories} columns={columns} />
            </div>
          </div>
        )}
      </PageContainer>

      {showForm && (
        <CategoryForm
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          onSubmit={editData ? handleUpdate : handleCreate}
          editData={editData}
        />
      )}
    </>
  );
};

export default CategoryList;