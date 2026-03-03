import { useEffect, useState, useCallback } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../services/categoryService";
import toast from 'react-hot-toast'
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
    try{
      await createCategory({ name });
    toast.success("Category added successfully");
    setShowForm(false);
    loadCategories();
  }catch(error) {
    toast.error("Failed to add category ");
  }
};

  const handleUpdate = async (name) => {
    try{

       await updateCategory(editData._id, { name });
  toast.success("Category Updated");
       setShowForm(false);
      setEditData(null);
    loadCategories();
    }catch(error){
      toast.error("Update Failed");
    }
   
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      try{
 await deleteCategory(id);
 toast.success("Category deleted");
      loadCategories();
    }catch(error){
      toast.error("Delete Failed");
    }
      }
     
  };

  const columns = [
    { key: "name", label: "Category Name" },

    {
      key: "isActive",
      label: "Status",
      render: (item) => (
        <span
          className={
            item.isActive ? "text-green-600" : "text-red-500"
          }
        >
          {item.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex gap-3">
          <button
            onClick={() => handleDelete(item._id)}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>

          <button
            onClick={() => {
              setEditData(item);
              setShowForm(true);
            }}
            className="text-blue-500 hover:underline"
          >
            Edit
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