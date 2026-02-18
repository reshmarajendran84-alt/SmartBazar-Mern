import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-indigo-600 font-semibold"
      : "text-gray-600";

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow p-5 space-y-4">

        <h2 className="text-xl font-bold">SmartBazar</h2>

        <nav className="flex flex-col gap-3">

          <NavLink to="/admin/dashboard" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/admin/categories" className={linkClass}>
            Categories
          </NavLink>

          <NavLink to="/admin/users" className={linkClass}>
            Users
          </NavLink>

          <NavLink to="/admin/products" className={linkClass}>
            Products
          </NavLink>

        </nav>
      </aside>

      {/* PAGE CONTENT */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
