import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../Layout/Header";
import AdminFooter from "../Layout/Footer";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Right Section */}
      <div className="flex flex-col flex-1">

        {/* Header */}
        <AdminHeader />

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-6">
          <Outlet />
        </div>

        {/* Footer */}
        <AdminFooter />

      </div>
    </div>
  );
};

export default AdminLayout;
