import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Topbar */}
        <div className="h-14 bg-white shadow flex items-center justify-between px-6">
          <h1 className="font-semibold text-lg">Admin Panel</h1>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-1.5 rounded text-sm hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;