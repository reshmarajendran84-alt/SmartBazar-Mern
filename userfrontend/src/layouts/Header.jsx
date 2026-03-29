import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiOutlineMenu, HiOutlineX, HiOutlineShoppingCart, HiOutlineSearch } from "react-icons/hi";
import { useCart } from "../context/CartContext";
import SearchBar from "../components/SearchBar";
import api from "../utils/api";

function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null); // ✅ moved here

  const totalItems = cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  // ✅ useEffect outside return
  useEffect(() => {
    if (!user) return;
    const fetchBalance = async () => {
      try {
        const { data } = await api.get("/wallet");
        setWalletBalance(data.wallet.balance);
      } catch {
        // silent fail
      }
    };
    fetchBalance();
  }, [user]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">

        {/* Top Row */}
        <div className="flex items-center justify-between h-16 w-full">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-purple-600">
            SmartBazar
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 mx-8">
            <SearchBar />
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-6">

            {/* ✅ Wallet balance */}
            {user && (
              <Link
                to="/wallet"
                className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                💰 ₹{walletBalance?.toFixed(2) ?? "0.00"}
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative">
              <HiOutlineShoppingCart className="text-2xl text-gray-700 hover:text-purple-600" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link
                  to="/user/profile"
                  className="text-sm text-gray-600 hover:text-purple-600"
                >
                  {user.name || user.email}
                </Link>
                <button
                  onClick={() => { logout(); navigate("/auth/login"); }}
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

          {/* Hamburger */}
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex justify-center gap-8 py-3 border-t text-gray-700 font-medium">
          <Link to="/" className="hover:text-purple-600">Home</Link>
          <Link to="/categories" className="hover:text-purple-600">Categories</Link>
          <Link to="/about" className="hover:text-purple-600">About</Link>
          <Link to="/my-orders" className="hover:text-purple-600">Orders</Link>
          <Link to="/user/profile" className="hover:text-purple-600">Profile</Link>
          <Link to="/wallet" className="hover:text-purple-600">Wallet</Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <div className="flex flex-col px-6 py-4 space-y-4">
            {/* <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border rounded-lg py-2 px-3 pr-8"
              />
              <HiOutlineSearch className="absolute right-2 top-2.5 text-gray-500" />
            </div> */}
<SearchBar />

            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/categories" onClick={() => setIsOpen(false)}>Categories</Link>
            <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/my-orders" onClick={() => setIsOpen(false)}>My Orders</Link>
            <Link to="/cart" onClick={() => setIsOpen(false)}>
              Cart ({totalItems})
            </Link>

            {/* ✅ Wallet in mobile menu */}
            {user && (
              <Link
                to="/wallet"
                onClick={() => setIsOpen(false)}
                className="text-indigo-600 font-medium"
              >
                💰 Wallet — ₹{walletBalance?.toFixed(2) ?? "0.00"}
              </Link>
            )}

            {user ? (
              <button
                onClick={() => { logout(); navigate("/auth/login"); setIsOpen(false); }}
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