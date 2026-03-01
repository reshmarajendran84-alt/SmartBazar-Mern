import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 space-y-4">
      <Link to="/admin">Dashboard</Link>
      <Link to="/admin/categories">Categories</Link>
      <Link to="/admin/products">Products</Link>
    </div>
  );
};

export default Sidebar;