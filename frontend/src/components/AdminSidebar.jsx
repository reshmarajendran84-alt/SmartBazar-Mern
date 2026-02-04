import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const linkClass = ({ isActive }) =>
    `block px-6 py-3 ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="h-14 flex items-center justify-center font-bold text-xl border-b">
        SmartBazar
      </div>

      <nav className="mt-4 space-y-1">
        <NavLink to="/admin/dashboard" className={linkClass}>
          📊 Dashboard
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          👥 Users
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
