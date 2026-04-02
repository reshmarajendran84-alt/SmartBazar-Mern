// import { useEffect, useState, useCallback } from "react";
// import {
//   getCategories,
//   createCategory,
//   deleteCategory,
//   updateCategory,
//   toggleCategoryStatus,
// } from "../../services/categoryService";

// import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
// import toast from "react-hot-toast";
// import CategoryForm from "./CategoryForm";
// import Table from "../../components/Table";
// import PageContainer from "../../components/PageContainer";

// const CategoryList = () => {
//   const [categories, setCategories] = useState([]);
//   const [showForm, setShowForm]     = useState(false);
//   const [loading, setLoading]       = useState(false);
//   const [editData, setEditData]     = useState(null);
//   const [confirmId, setConfirmId]   = useState(null);

//   const loadCategories = useCallback(async () => {
//     try {
//       setLoading(true);
//       const { data } = await getCategories();
//       const all = Array.isArray(data) ? data : data.categories || [];
//       // setCategories(all.filter(cat => cat.isActive !== false)); // ✅ hide soft-deleted
//       setCategories(all); // show all including blocked

//     } catch (err) {
//       console.error(err.response?.data);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadCategories();
//   }, [loadCategories]);

//   const handleCreate = async (name) => {
//     try {
//       await createCategory({ name });
//       toast.success("Category added successfully");
//       setShowForm(false);
//       loadCategories();
//     } catch (err) {
//       console.error("Create error:", err.response?.data || err.message);
//       toast.error(err.response?.data?.message || "Failed to add category");
//     }
//   };

//   const handleUpdate = async (name) => {
//     try {
//       await updateCategory(editData._id, { name });
//       toast.success("Category updated");
//       setShowForm(false);
//       setEditData(null);
//       loadCategories();
//     } catch (err) {
//       console.error("Update error:", err.response?.data || err.message);
//       toast.error(err.response?.data?.message || "Update failed");
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteCategory(id);          // ✅ backend sets isActive: false
//       toast.success("Category deleted");
//       setConfirmId(null);
//       loadCategories();                  // ✅ filter removes it from view
//     } catch (err) {
//       console.error("Delete error:", err.response?.data || err.message);
//       toast.error(err.response?.data?.message || "Delete failed");
//     }
//   };

//   const handleToggleStatus = async (id, currentStatus) => {
//     try {
//       await toggleCategoryStatus(id);
//       toast.success(`Category ${currentStatus ? "blocked" : "unblocked"} successfully`);
//       loadCategories();
//     } catch (err) {
//       console.error("Toggle error:", err.response?.data || err.message);
//       toast.error(err.response?.data?.message || "Status update failed");
//     }
//   };

//   const columns = [
//     {
//       key: "name",
//       label: "Category Name",
//       render: (item) => (
//         <span className="font-medium text-gray-700">{item.name}</span>
//       ),
//     },
//     {
//       key: "isActive",
//       label: "Status",
//       render: (item) => (
//         <button
//           onClick={() => handleToggleStatus(item._id, item.isActive)}
//           className={`px-3 py-1 text-xs font-semibold rounded-full cursor-pointer transition-all
//             ${item.isActive
//               ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600"
//               : "bg-red-100 text-red-600 hover:bg-green-100 hover:text-green-700"
//             }`}
//         >
//           {item.isActive ? "Active" : "Blocked"}
//         </button>
//       ),
//     },
//     {
//       key: "productCount",
//       label: "Total Products",
//       render: (item) => (
//         <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
//           {item.productCount || 0}
//         </span>
//       ),
//     },
//     {
//       key: "actions",
//       label: "Actions",
//       render: (item) => (
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => { setEditData(item); setShowForm(true); }}
//             className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
//           >
//             <FiEdit size={16} />
//           </button>

//           {confirmId === item._id ? (
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-gray-500">Sure?</span>
//               <button
//                 onClick={() => handleDelete(item._id)}
//                 className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
//               >
//                 Yes
//               </button>
//               <button
//                 onClick={() => setConfirmId(null)}
//                 className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
//               >
//                 No
//               </button>
//             </div>
//           ) : (
//             <button
//               onClick={() => setConfirmId(item._id)}
//               className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
//             >
//               <FiTrash2 size={16} />
//             </button>
//           )}
//         </div>
//       ),
//     },
//   ];

//   return (
//     <>
//       <PageContainer
//         title="Categories"
//         action={
//           <button
//             onClick={() => { setEditData(null); setShowForm(true); }}
//             className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow"
//           >
//             <FiPlus />
//             Add Category
//           </button>
//         }
//       >
//         {loading ? (
//           <p className="text-center text-gray-500 py-8">Loading categories...</p>
//         ) : (
//           <div className="bg-white shadow-md rounded-xl overflow-hidden">
//             <div className="overflow-x-auto">
//               <Table data={categories} columns={columns} />
//             </div>
//           </div>
//         )}
//       </PageContainer>

//       {showForm && (
//         <CategoryForm
//           onClose={() => { setShowForm(false); setEditData(null); }}
//           onSubmit={editData ? handleUpdate : handleCreate}
//           editData={editData}
//         />
//       )}
//     </>
//   );
// };

// export default CategoryList;




import { useEffect, useState, useCallback } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  toggleCategoryStatus,
} from "../../services/categoryService";

import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import CategoryForm from "./CategoryForm";
import Table from "../../components/Table";
import PageContainer from "../../components/PageContainer";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [editData, setEditData]     = useState(null);
  const [confirmId, setConfirmId]   = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getCategories();
      const all = Array.isArray(data) ? data : data.categories || [];
      setCategories(all); // ✅ show ALL (deleted filtered in backend, blocked shown with toggle)
    } catch (err) {
      console.error(err.response?.data);
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
    } catch (err) {
      console.error("Create error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to add category");
    }
  };

  const handleUpdate = async (name) => {
    try {
      await updateCategory(editData._id, { name });
      toast.success("Category updated");
      setShowForm(false);
      setEditData(null);
      loadCategories();
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);        // ✅ sets isDeleted: true
      toast.success("Category deleted");
      setConfirmId(null);
      loadCategories();                // backend filters isDeleted, row disappears
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // ✅ Toggle flips isActive between true/false — row stays visible
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await toggleCategoryStatus(id);
      toast.success(`Category ${currentStatus ? "blocked" : "unblocked"} successfully`);
      loadCategories();
    } catch (err) {
      console.error("Toggle error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Status update failed");
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
      render: (item) => (
        // ✅ Toggle — always visible, switches Active ↔ Blocked
        <button
          onClick={() => handleToggleStatus(item._id, item.isActive)}
          className={`px-3 py-1 text-xs font-semibold rounded-full cursor-pointer transition-all
            ${item.isActive
              ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600"
              : "bg-red-100 text-red-600 hover:bg-green-100 hover:text-green-700"
            }`}
        >
          {item.isActive ? "Active" : "Blocked"}
        </button>
      ),
    },
    {
      key: "productCount",
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setEditData(item); setShowForm(true); }}
            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
          >
            <FiEdit size={16} />
          </button>

          {confirmId === item._id ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Sure?</span>
              <button
                onClick={() => handleDelete(item._id)}
                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmId(item._id)}
              className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
            >
              <FiTrash2 size={16} />
            </button>
          )}
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
            onClick={() => { setEditData(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg
                       text-sm font-medium hover:bg-indigo-700 transition shadow"
          >
            <FiPlus />
            Add Category
          </button>
        }
      >
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading categories...</p>
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
          onClose={() => { setShowForm(false); setEditData(null); }}
          onSubmit={editData ? handleUpdate : handleCreate}
          editData={editData}
        />
      )}
    </>
  );
};

export default CategoryList;