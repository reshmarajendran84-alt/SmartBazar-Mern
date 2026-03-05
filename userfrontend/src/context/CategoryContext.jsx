import { createContext, useContext, useEffect, useState } from "react";
import * as api from "../services/categoryService";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    try {
      const res = await api.getCategories();
      setCategories(res.data.categories || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, loadCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);