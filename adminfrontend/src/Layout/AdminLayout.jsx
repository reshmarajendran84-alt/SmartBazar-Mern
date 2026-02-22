import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
      isActive
        ? "bg-indigo-100 text-indigo-600 font-semibold"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen flex bg-gray-100">

      <header className="md:hidden fixed top-0 left-0 right-0 bg-white shadow flex items-center justify-between px-4 h-14 z-50">
        <h1 className="font-bold text-indigo-600 text-lg">SmartBazar</h1>
        <button onClick={() => setOpen(true)}>
          <Menu />
        </button>
      </header>

      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow-lg transform 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300 z-50`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-bold text-indigo-600">SmartBazar</h1>

          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="p-4 space-y-2">

          <NavLink to="/admin/dashboard" className={linkClass}>
            📊 Dashboard
          </NavLink>

          <NavLink to="/admin/categories" className={linkClass}>
            🗂 Categories
          </NavLink>

          <NavLink to="/admin/users" className={linkClass}>
            👥 Users
          </NavLink>

          <NavLink to="/admin/products" className={linkClass}>
            🛍 Products
          </NavLink>

        </nav>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
