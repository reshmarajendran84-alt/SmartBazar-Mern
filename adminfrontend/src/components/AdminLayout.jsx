import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../Layout/Header";
import { Outlet } from "react-router-dom";
import { AdminOrderProvider } from "../context/OrderContext";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <AdminOrderProvider>
      <div className="flex bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <Sidebar open={open} setOpen={setOpen} />

        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          <Header setOpen={setOpen} />

          <main className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            <div className="max-w-7xl mx-auto w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AdminOrderProvider>
  );
};

export default AdminLayout;