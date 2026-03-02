import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../Layout/Header";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1">
        <Header setOpen={setOpen} />

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;