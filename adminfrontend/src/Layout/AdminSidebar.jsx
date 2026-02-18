import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const linkClass = ({ isActive }) =>
    `block px-6 py-3 rounded-lg mx-3 transition ${
      isActive
        ? "bg-white text-indigo-700 font-semibold"
        : "text-indigo-100 hover:bg-white/20"
    }`;

  return (
    <div className="hidden md:flex md:flex-col w-64 
                    bg-gradient-to-b from-indigo-600 to-purple-700 
                    text-white shadow-xl min-h-screen">

      <div className="h-16 flex items-center justify-center 
                      font-bold text-xl border-b border-white/20">
        SmartBazar
      </div>

      <nav className="mt-6 space-y-2">
        <NavLink to="/admin/dashboard" className={linkClass}>
          📊 Dashboard
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          👥 Users
        </NavLink>
        <NavLink to="/admin/categories" className={linkClass}>
  🗂 Categories
</NavLink>
<NavLink to="/admin/products/create" className={linkClass}>
   🛒 Add Product
</NavLink>


      </nav>
    </div>
  );
};

export default AdminSidebar;
