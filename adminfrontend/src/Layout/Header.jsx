import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../utils/adminLogout";

const Header = ({ setOpen }) => {
  const navigate = useNavigate();

  // const logout = () => {
  //   localStorage.removeItem("adminToken");
  //   navigate("/admin/login");
  // };

  return (
    <header className="h-16 sticky top-0 z-30
                       bg-white/70 backdrop-blur-lg
                       border-b
                       flex items-center justify-between
                       px-4 md:px-6">

      {/* HAMBURGER */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden"
      >
        <Menu size={26} />
      </button>

      <h1 className="font-semibold text-lg text-gray-700">
        Admin Dashboard
      </h1>

      <button
        onClick={adminLogout}
        className="bg-red-500 hover:bg-red-600
                   text-white px-4 py-2 rounded-lg text-sm
                   transition"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;