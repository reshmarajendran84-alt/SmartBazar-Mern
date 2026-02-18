import CategoryForm from "./CategoryForm"
import CategoryList from "./CategoryList";

const CategoryPage = () => {
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-gray-800">
        Category Management
      </h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow">
        <CategoryForm />
      </div>

      {/* LIST */}
      <div className="bg-white p-4 rounded-xl shadow">
        <CategoryList />
      </div>

    </div>
  );
};

export default CategoryPage;
