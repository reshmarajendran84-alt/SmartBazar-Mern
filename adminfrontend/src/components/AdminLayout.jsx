import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../Layout/Header";
import { Outlet } from "react-router-dom";
import { AdminOrderProvider } from "../context/OrderContext";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <AdminOrderProvider>
      {/* 
        AdminOrderProvider wraps everything here.
        This means AdminOrdersPage, FilterBar, OrderRow
        — ALL of them can call useAdminOrders() and get
        the same shared state. No prop drilling needed.
      */}
      <div className="flex bg-gray-100 min-h-screen">
        <Sidebar open={open} setOpen={setOpen} />

        <div className="flex-1">
          <Header setOpen={setOpen} />

          <main className="p-4 md:p-6">
            <Outlet />
            {/* 
              Outlet renders whatever route is active.
              /admin/orders → renders AdminOrdersPage
              /admin/products → renders AdminProductsPage
              etc.
            */}
          </main>
        </div>
      </div>
    </AdminOrderProvider>
  );
};

export default AdminLayout;