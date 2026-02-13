import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="h-16 bg-white shadow-sm 
                    flex items-center justify-between 
                    px-6 md:px-8">

      <h1 className="font-semibold text-lg text-gray-700">
        SmartBazar Admin
      </h1>

      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 
                   text-white px-4 py-2 
                   rounded-lg text-sm transition"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminHeader;
