import { AdminOrderProvider } from "../../context/AdminOrderContext";

const AdminLayout = () => {
  return (
    <AdminOrderProvider>
      {/* AdminOrderProvider wraps everything so ALL admin pages
          can access orders state without passing props */}
      <div className="flex min-h-screen">

        <aside className="w-56 bg-gray-900 ...">
          ...
          <NavLink to="/admin/orders">Orders</NavLink>
          ...
        </aside>

        <main className="flex-1 bg-gray-50 p-8">
          <Outlet />
        </main>

      </div>
    </AdminOrderProvider>
  );
};