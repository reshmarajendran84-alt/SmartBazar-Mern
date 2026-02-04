import { Outlet, useNavigate } from "react-router-dom";
import AdminUsers from "../pages/AdminUsers";

const AdminLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow px-6 py-4 flex justify-between">
        <h1 className="font-bold text-xl">Admin Dashboard</h1>
        <button onClick={logout} className="btn bg-red-500 text-white">
          Logout
        </button>
      </header>

      <main className="p-6">
        <Outlet />

      </main>

<AdminUsers/>    </div>
  );
};

export default AdminLayout;
