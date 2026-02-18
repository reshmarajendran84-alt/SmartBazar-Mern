import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const CategoryContext = createContext();

export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

const loadCategories = async () => {
  try {
    setLoading(true);
    const { data } = await api.get("/admin/category");
    setCategories(data);
  } catch (err) {
    console.log(err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};


  // ✅ ADD
  const addCategory = async (formData) => {
    await api.post("/admin/category", formData);
    loadCategories();
  };

  // ✅ UPDATE
  const updateCategory = async (id, formData) => {
    await api.put(`/admin/category/${id}`, formData);
    setEditing(null);
    loadCategories();
  };

  // ✅ DELETE
  const deleteCategory = async (id) => {
    await api.delete(`/admin/category/${id}`);
    loadCategories();
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        editing,
        setEditing,
        addCategory,
        updateCategory,
        deleteCategory,
        loading,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
