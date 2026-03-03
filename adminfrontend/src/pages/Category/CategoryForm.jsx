import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CategoryForm = ({ onClose, onSubmit,editData }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name required");

    onSubmit(name);
  };
useEffect(()=>{
  if(editData){
    setName(editData.name);

  }else{
    setName("");

  }
},[editData]);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-6 rounded-2xl space-y-4 shadow-lg"
      >
        <h2 className="text-xl font-bold">{editData ? "Edit Category":"Add Category"}</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="Category name"
        />

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="text-gray-500">
            Cancel
          </button>

          {/* <button
            type="submit"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
          >
            Save
          </button> */}
        <button type="submit"   className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
>
          {editData ?"update":"save"}
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