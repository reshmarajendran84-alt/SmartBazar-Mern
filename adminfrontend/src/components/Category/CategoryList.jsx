import { useCategory } from "../../context/CategoryContext"
import {memo} from 'react';
const CategoryList = () => {
  const { categories, setEditing, deleteCategory, loading } = useCategory();

  if (loading) return <p>Loading...</p>;

  return (
    <table className="w-full border">

      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left">Actions</th>
        </tr>
      </thead>

      <tbody>
        {categories.map((cat) => (
          <tr key={cat._id} className="border-t">

            <td className="p-2">{cat.name}</td>

            <td className="p-2 space-x-2">
              <button
                onClick={() => setEditing(cat)}
                className="text-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => deleteCategory(cat._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </td>

          </tr>
        ))}
      </tbody>

    </table>
  );
};

export default memo(CategoryList);

 
