import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineShoppingCart,
} from "react-icons/hi";
import { useCart } from "../context/CartContext";
import SearchBar from "../components/SearchBar";
import api from "../utils/api";

function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);

  const totalItems =
    cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  useEffect(() => {
    if (!user) return;
    const fetchBalance = async () => {
      try {
        const { data } = await api.get("/wallet");
        setWalletBalance(data.wallet.balance);
      } catch {}
    };
    fetchBalance();
  }, [user]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">

        {/* Top Row */}
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            SmartBazar
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 mx-8">
            <SearchBar />
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-6">

            {/* Wallet */}
            {user && (
              <Link
                to="/wallet"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
              >
                💰 ₹{walletBalance?.toFixed(2) ?? "0.00"}
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative group">
              <HiOutlineShoppingCart className="text-2xl text-gray-700 group-hover:text-indigo-600 transition" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <>
                <Link
                  to="/user/profile"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition"
                >
                  {user.name || user.email}
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate("/auth/login");
                  }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth/login"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex justify-center gap-8 py-3 text-gray-700 font-medium">
          {["Home", "Categories", "About", "My Orders", "Profile", "Wallet"].map(
            (item, i) => (
              <Link
                key={i}
                to={
                  item === "Home"
                    ? "/"
                    : `/${item.toLowerCase().replace(" ", "-")}`
                }
                className="relative group"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
              </Link>
            )
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-full bg-white z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6">

          <SearchBar />

          {["Home", "Categories", "About", "My Orders", "Cart"].map(
            (item, i) => (
              <Link
                key={i}
                to={`/${item.toLowerCase().replace(" ", "-")}`}
                onClick={() => setIsOpen(false)}
                className="block text-lg font-medium text-gray-700 hover:text-indigo-600"
              >
                {item}
              </Link>
            )
          )}

          {user ? (
            <button
              onClick={() => {
                logout();
                navigate("/auth/login");
                setIsOpen(false);
              }}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth/login"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-indigo-600 text-white py-3 rounded-lg"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;