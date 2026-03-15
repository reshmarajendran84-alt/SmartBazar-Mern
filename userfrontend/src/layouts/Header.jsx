import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineShoppingCart,
  HiOutlineSearch,
} from "react-icons/hi";
import { useCart } from "../context/CartContext";
import SearchBar from "../components/SearchBar";
function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
const [keyword,setKeyword]=useState("");

const handleSearch = (e) => {
  e.preventDefault();
  if (!keyword.trim()) return;

  navigate(`/products?search=${keyword}`);
};
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">

        {/* Top Row */}
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-purple-600">
            SmartBazar
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 mx-8 relative">
 {/* <form onSubmit={handleSearch} className="relative">
  <input
    type="text"
    placeholder="Search..."
    value={keyword}
    onChange={(e) => setKeyword(e.target.value)}
    className="w-full border rounded-lg py-2 px-3 pr-8"
  />

  <button type="submit">
    <HiOutlineSearch className="absolute right-2 top-2.5 text-gray-500" />
  </button>
</form> */}
<SearchBar/>
</div>
          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-6">

            {/* Cart */}
            <Link to="/cart" className="relative">
              <HiOutlineShoppingCart className="text-2xl text-gray-700 hover:text-purple-600" />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  {user.name || user.email}
                </span>

                <button
                  onClick={() => {
                    logout();
                    navigate("/auth/login");
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth/login"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Hamburger Button */}
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>

        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex justify-center gap-8 py-3 border-t text-gray-700 font-medium">
          <Link to="/" className="hover:text-purple-600">Home</Link>
          <Link to="/categories" className="hover:text-purple-600">Categories</Link>
          <Link to="/about" className="hover:text-purple-600">About</Link>
        </nav>

      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md border-t">

          <div className="flex flex-col px-6 py-4 space-y-4">

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border rounded-lg py-2 px-3 pr-8"
              />
              <HiOutlineSearch className="absolute right-2 top-2.5 text-gray-500" />
            </div>

            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/categories" onClick={() => setIsOpen(false)}>Categories</Link>
            <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/cart" onClick={() => setIsOpen(false)}>Cart ({cartCount})</Link>

            {user ? (
              <button
                onClick={() => {
                  logout();
                  navigate("/auth/login");
                  setIsOpen(false);
                }}
                className="bg-purple-600 text-white py-2 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth/login"
                className="bg-purple-600 text-white py-2 rounded-lg text-center"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}

          </div>

        </div>
      )}

    </header>
  );
}

export default Header;