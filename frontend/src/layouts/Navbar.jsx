import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between">
      <h1 className="font-bold text-xl">SmartBazar</h1>

      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Hello, {user.name || user.email}
          </span>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-red-500"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    
    </nav>
  );
};

export default Navbar;
