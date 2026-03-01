// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

// function Navbar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <header className="bg-white shadow-md sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-5 lg:px-10">

//         <div className="flex justify-between items-center h-16">

//           {/* Logo */}
//           <Link
//             to="/"
//             className="text-2xl font-bold text-purple-600 tracking-wide"
//           >
//             SmartBazar
//           </Link>

//           {/* Desktop Menu */}
//           <nav className="hidden md:flex items-center gap-8 font-medium text-gray-700">
//             <Link to="/" className="hover:text-purple-600 transition">
//               Home
//             </Link>
//             <Link to="/shop" className="hover:text-purple-600 transition">
//               Shop
//             </Link>
//             <Link to="/about" className="hover:text-purple-600 transition">
//               About
//             </Link>
//           </nav>

//           {/* Right Section */}
//           <div className="hidden md:flex items-center gap-4">

//             {user ? (
//               <>
//                 <span className="text-sm text-gray-600">
//                   Hello, {user.name || user.email}
//                 </span>

//                 <button
//                   onClick={() => {
//                     logout();
//                     navigate("/auth/login");
//                   }}
//                   className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <Link
//                 to="/auth/login"
//                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
//               >
//                 Login
//               </Link>
//             )}
//           </div>

//           {/* Mobile Toggle */}
//           <button
//             className="md:hidden text-2xl text-gray-700"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             {isOpen ? <HiOutlineX /> : <HiOutlineMenu />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="md:hidden bg-white border-t shadow-md">
//           <div className="flex flex-col px-6 py-4 space-y-4 text-gray-700 font-medium">
//             <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
//             <Link to="/shop" onClick={() => setIsOpen(false)}>Shop</Link>
//             <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>

//             {user ? (
//               <>
//                 <div className="text-sm text-gray-500">
//                   {user.name || user.email}
//                 </div>
//                 <button
//                   onClick={() => {
//                     logout();
//                     navigate("/auth/login");
//                     setIsOpen(false);
//                   }}
//                   className="bg-purple-600 text-white py-2 rounded-lg"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <Link
//                 to="/auth/login"
//                 className="bg-purple-600 text-white py-2 rounded-lg text-center"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Login
//               </Link>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }

// export default Navbar;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSingleProduct } from "../services/productService";
import { useCart } from "../context/CartContext";

const SingleProduct = () => {

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const res = await fetchSingleProduct(id);
      setProduct(res.data.product);
    } catch (err) {
      console.log(err);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6 grid grid-cols-2 gap-6">

      <img
        src={product.images[0]}
        className="w-full h-96 object-cover rounded"
      />

      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-xl text-green-600">₹{product.price}</p>

        <p className="my-4">{product.description}</p>

        <button
          onClick={() => addToCart(product)}
          className="bg-indigo-600 text-white px-6 py-2 rounded"
        >
          Add To Cart
        </button>
      </div>

    </div>
  );
};

export default SingleProduct;