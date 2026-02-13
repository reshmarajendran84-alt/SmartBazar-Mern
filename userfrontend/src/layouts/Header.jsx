import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineShoppingCart,
  HiOutlineSearch,
} from "react-icons/hi";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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
            <input
              type="text"
              placeholder="Search products..."
              className="w-full border rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <HiOutlineSearch className="absolute right-3 top-2.5 text-gray-500 text-xl" />
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-6">

            <Link to="/cart" className="relative">
              <HiOutlineShoppingCart className="text-2xl text-gray-700 hover:text-purple-600" />
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-1.5 rounded-full">
                2
              </span>
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

          {/* Mobile Menu Button */}
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
          <Link to="/shop" className="hover:text-purple-600">Shop</Link>
          <Link to="/categories" className="hover:text-purple-600">Categories</Link>
          <Link to="/about" className="hover:text-purple-600">About</Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <div className="flex flex-col px-6 py-4 space-y-4 text-gray-700">

            <input
              type="text"
              placeholder="Search..."
              className="border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/shop" onClick={() => setIsOpen(false)}>Shop</Link>
            <Link to="/categories" onClick={() => setIsOpen(false)}>Categories</Link>
            <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/cart" onClick={() => setIsOpen(false)}>Cart</Link>

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
