// import { useState, useCallback, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useAddress } from "../context/AddressContext";
// import { toast } from "react-toastify";
// import api from "../utils/api";

// const UserProfile = () => {
//   const navigate = useNavigate();
//   const { user, setUser, setLoading } = useAuth();
//   const { addresses, loading, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddress();

//   const emptyAddress = { addressLine: "", city: "", state: "", pincode: "" };
//   const [newAddress, setNewAddress] = useState(emptyAddress);
//   const [editingId, setEditingId] = useState(null);
//   const [error, setError] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [wallet, setWallet] = useState(null); // ✅ wallet state

//   // ✅ fetch wallet
//   useEffect(() => {
//     const fetchWallet = async () => {
//       try {
//         const { data } = await api.get("/wallet");
//         setWallet(data.wallet);
//       } catch (err) {
//         console.error("Wallet fetch error:", err);
//       }
//     };
//     fetchWallet();
//   }, []);

//   const logout = useCallback(() => {
//     localStorage.removeItem("token");
//     setUser(null);
//     setLoading(false);
//     navigate("/auth/login");
//   }, [navigate, setUser, setLoading]);

//   const handleSubmit = async () => {
//     if (!newAddress.addressLine) return toast.warning("Address is required");
//     if (!newAddress.city) return toast.warning("City is required");
//     if (!newAddress.state) return toast.warning("State is required");
//     if (!/^\d{6}$/.test(newAddress.pincode)) return toast.warning("Enter valid 6-digit pincode");

//     try {
//       setSaving(true);
//       if (editingId) {
//         await updateAddress(editingId, newAddress);
//         toast.success("Address updated successfully ✅");
//         setEditingId(null);
//       } else {
//         await addAddress(newAddress);
//         toast.success("Address added successfully 🎉");
//       }
//       setNewAddress(emptyAddress);
//     } catch (err) {
//       toast.error("Something went wrong ❌");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <div className="min-h-[calc(100vh-140px)] bg-gray-100 py-10 px-4">
//       <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">

//         <h2 className="text-3xl font-bold text-gray-800 mb-2">User Profile</h2>
//         <p className="text-gray-600 mb-6">
//           Email: <span className="font-semibold">{user?.email}</span>
//         </p>

//         {/* ✅ Wallet balance card */}
//         <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 flex justify-between items-center">
//           <div>
//             <p className="text-sm text-indigo-500 font-medium">Wallet Balance</p>
//             <p className="text-2xl font-bold text-indigo-700">
//               ₹{wallet?.balance?.toFixed(2) || "0.00"}
//             </p>
//           </div>
//           <Link
//             to="/wallet"
//             className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
//           >
//             View Wallet →
//           </Link>
//         </div>

//         {/* ✅ Quick links */}
//         <div className="flex gap-3 mb-6">
//           <Link
//             to="/my-orders"
//             className="flex-1 text-center border border-indigo-300 text-indigo-600 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition"
//           >
//             My Orders
//           </Link>
//           <button
//             onClick={logout}
//             className="flex-1 border border-red-300 text-red-500 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition"
//           >
//             Logout
//           </button>
//         </div>

//         {/* Address form */}
//         <h3 className="text-lg font-semibold mb-3">
//           {editingId ? "Edit Address" : "Add Address"}
//         </h3>

//         <div className="grid md:grid-cols-2 gap-3 mb-2">
//           {["addressLine", "city", "state"].map((field) => (
//             <input
//               key={field}
//               placeholder={field}
//               className="border px-3 py-2 rounded"
//               value={newAddress[field]}
//               onChange={(e) => setNewAddress({ ...newAddress, [field]: e.target.value })}
//             />
//           ))}
//           <input
//             type="text"
//             placeholder="Pincode"
//             className="border px-3 py-2 rounded"
//             value={newAddress.pincode}
//             maxLength={6}
//             onChange={(e) => {
//               const onlyNumbers = e.target.value.replace(/\D/g, "");
//               setNewAddress({ ...newAddress, pincode: onlyNumbers });
//             }}
//           />
//         </div>

//         {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

//         <button
//           onClick={handleSubmit}
//           disabled={saving}
//           className="bg-indigo-600 text-white px-5 py-2 rounded mb-6 disabled:opacity-50"
//         >
//           {saving ? "Saving..." : editingId ? "Update Address" : "Add Address"}
//         </button>

//         <h3 className="text-lg font-semibold mb-3">Saved Addresses</h3>
//         {editingId && (
//           <button
//             onClick={() => { setEditingId(null); setNewAddress(emptyAddress); setError(""); }}
//             className="ml-3 text-gray-600 underline mb-3"
//           >
//             Cancel
//           </button>
//         )}

//         {addresses.length === 0 && <p>No addresses found</p>}

//         {addresses.map((addr) => (
//           <div
//             key={addr._id}
//             className="bg-gray-50 rounded-xl p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
//           >
//             <div>
//               <p>{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>
//               {addr.isDefault && <span className="text-green-600 text-sm">Default ⭐</span>}
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={async () => {
//                   try { await setDefaultAddress(addr._id); toast.success("Default address updated ⭐"); }
//                   catch { toast.error("Failed to set default address ❌"); }
//                 }}
//                 disabled={addr.isDefault || editingId}
//                 className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
//               >
//                 Set Default
//               </button>
//               <button
//                 onClick={() => {
//                   setNewAddress({ addressLine: addr.addressLine, city: addr.city, state: addr.state, pincode: addr.pincode });
//                   setEditingId(addr._id);
//                 }}
//                 className="px-3 py-1 bg-yellow-500 text-white rounded"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={async () => {
//                   if (!window.confirm("Are you sure you want to delete this address?")) return;
//                   try {
//                     await deleteAddress(addr._id);
//                     toast.success("Address deleted successfully 🗑️");
//                     if (editingId === addr._id) { setEditingId(null); setNewAddress(emptyAddress); setError(""); }
//                   } catch { toast.error("Failed to delete address ❌"); }
//                 }}
//                 className="px-3 py-1 bg-red-500 text-white rounded"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UserProfile;


import { useState, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAddress } from "../context/AddressContext";
import { toast } from "react-toastify";
import api from "../utils/api";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, setUser, setLoading } = useAuth();
  const { addresses, loading, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddress();

  // ✅ ADDED name and phone to emptyAddress
  const emptyAddress = { 
    name: "",        // ← ADD THIS
    phone: "",       // ← ADD THIS
    addressLine: "", 
    city: "", 
    state: "", 
    pincode: "" 
  };
  
  const [newAddress, setNewAddress] = useState(emptyAddress);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [wallet, setWallet] = useState(null);

  // Fetch wallet
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const { data } = await api.get("/wallet");
        setWallet(data.wallet);
      } catch (err) {
        console.error("Wallet fetch error:", err);
      }
    };
    fetchWallet();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setLoading(false);
    navigate("/auth/login");
  }, [navigate, setUser, setLoading]);

  const handleSubmit = async () => {
    // ✅ ADD validation for name and phone
    if (!newAddress.name) return toast.warning("Name is required");
    if (!newAddress.phone) return toast.warning("Phone number is required");
    if (!newAddress.addressLine) return toast.warning("Address is required");
    if (!newAddress.city) return toast.warning("City is required");
    if (!newAddress.state) return toast.warning("State is required");
    if (!/^\d{6}$/.test(newAddress.pincode)) return toast.warning("Enter valid 6-digit pincode");
    if (!/^\d{10}$/.test(newAddress.phone)) return toast.warning("Enter valid 10-digit phone number");

    try {
      setSaving(true);
      if (editingId) {
        await updateAddress(editingId, newAddress);
        toast.success("Address updated successfully ✅");
        setEditingId(null);
      } else {
        await addAddress(newAddress);
        toast.success("Address added successfully 🎉");
      }
      setNewAddress(emptyAddress);
    } catch (err) {
      toast.error("Something went wrong ❌");
    } finally {
      setSaving(false);
    }
  };

  // Handle edit - include name and phone when editing
  const handleEdit = (addr) => {
    setNewAddress({ 
      name: addr.name || "",
      phone: addr.phone || "",
      addressLine: addr.addressLine, 
      city: addr.city, 
      state: addr.state, 
      pincode: addr.pincode 
    });
    setEditingId(addr._id);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-[calc(100vh-140px)] bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">

        <h2 className="text-3xl font-bold text-gray-800 mb-2">User Profile</h2>
        <p className="text-gray-600 mb-6">
          Email: <span className="font-semibold">{user?.email}</span>
        </p>

        {/* Wallet balance card */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-indigo-500 font-medium">Wallet Balance</p>
            <p className="text-2xl font-bold text-indigo-700">
              ₹{wallet?.balance?.toFixed(2) || "0.00"}
            </p>
          </div>
          <Link
            to="/wallet"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
          >
            View Wallet →
          </Link>
        </div>

        {/* Quick links */}
        <div className="flex gap-3 mb-6">
          <Link
            to="/my-orders"
            className="flex-1 text-center border border-indigo-300 text-indigo-600 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition"
          >
            My Orders
          </Link>
          <button
            onClick={logout}
            className="flex-1 border border-red-300 text-red-500 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>

        {/* Address form - ADDED name and phone inputs */}
        <h3 className="text-lg font-semibold mb-3">
          {editingId ? "Edit Address" : "Add Address"}
        </h3>

        <div className="grid md:grid-cols-2 gap-3 mb-2">
          {/* ✅ NEW: Name input */}
          <input
            type="text"
            placeholder="Full Name *"
            className="border px-3 py-2 rounded"
            value={newAddress.name}
            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
          />
          
          {/* ✅ NEW: Phone input */}
          <input
            type="tel"
            placeholder="Phone Number *"
            className="border px-3 py-2 rounded"
            value={newAddress.phone}
            maxLength={10}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, "");
              setNewAddress({ ...newAddress, phone: onlyNumbers });
            }}
          />
          
          <input
            placeholder="Address Line *"
            className="border px-3 py-2 rounded"
            value={newAddress.addressLine}
            onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
          />
          
          <input
            placeholder="City *"
            className="border px-3 py-2 rounded"
            value={newAddress.city}
            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
          />
          
          <input
            placeholder="State *"
            className="border px-3 py-2 rounded"
            value={newAddress.state}
            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
          />
          
          <input
            type="text"
            placeholder="Pincode *"
            className="border px-3 py-2 rounded"
            value={newAddress.pincode}
            maxLength={6}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, "");
              setNewAddress({ ...newAddress, pincode: onlyNumbers });
            }}
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-indigo-600 text-white px-5 py-2 rounded mb-6 disabled:opacity-50"
        >
          {saving ? "Saving..." : editingId ? "Update Address" : "Add Address"}
        </button>

        <h3 className="text-lg font-semibold mb-3">Saved Addresses</h3>
        {editingId && (
          <button
            onClick={() => { setEditingId(null); setNewAddress(emptyAddress); setError(""); }}
            className="ml-3 text-gray-600 underline mb-3"
          >
            Cancel
          </button>
        )}

        {addresses.length === 0 && <p>No addresses found</p>}

        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="bg-gray-50 rounded-xl p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              {/* ✅ Display name and phone */}
              <p className="font-medium">{addr.name || "No name"}</p>
              <p>{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>
              <p className="text-sm text-gray-600">Phone: {addr.phone || "No phone"}</p>
              {addr.isDefault && <span className="text-green-600 text-sm">Default ⭐</span>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  try { await setDefaultAddress(addr._id); toast.success("Default address updated ⭐"); }
                  catch { toast.error("Failed to set default address ❌"); }
                }}
                disabled={addr.isDefault || editingId}
                className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Set Default
              </button>
              <button
                onClick={() => handleEdit(addr)}  // ✅ Use handleEdit function
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  if (!window.confirm("Are you sure you want to delete this address?")) return;
                  try {
                    await deleteAddress(addr._id);
                    toast.success("Address deleted successfully 🗑️");
                    if (editingId === addr._id) { setEditingId(null); setNewAddress(emptyAddress); setError(""); }
                  } catch { toast.error("Failed to delete address ❌"); }
                }}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;