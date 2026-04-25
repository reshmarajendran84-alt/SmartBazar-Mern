import { useState, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAddress } from "../context/AddressContext";
import { toast } from "react-toastify";
import api from "../utils/api";

const InputField = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
    )}
    <input
      className="border border-gray-200 bg-gray-50 px-3 py-2.5 rounded-lg text-sm
                 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
      {...props}
    />
  </div>
);

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, setUser, setLoading } = useAuth();
  const { addresses, loading, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddress();

  const [wallet, setWallet] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "", phone: "", addressLine: "", city: "", state: "", pincode: ""
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    api.get("/wallet").then(res => setWallet(res.data.wallet));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setLoading(false);
    navigate("/auth/login");
  };

  const patch = (key) => (e) =>
    setNewAddress(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateAddress(editingId, newAddress);
        toast.success("Updated ✅");
      } else {
        await addAddress(newAddress);
        toast.success("Added 🎉");
      }
      setNewAddress({ name:"", phone:"", addressLine:"", city:"", state:"", pincode:"" });
      setEditingId(null);
    } catch {
      toast.error("Error ❌");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">My Profile</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold">
            {user?.email?.[0]?.toUpperCase()}
          </div>
        </div>

        {/* WALLET */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-xs opacity-80">Wallet Balance</p>
            <h3 className="text-3xl font-bold">₹{wallet?.balance || 0}</h3>
          </div>

          <Link to="/wallet" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30">
            View →
          </Link>
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/my-orders" className="bg-white shadow p-4 text-center rounded-xl hover:bg-gray-50">
            📦 Orders
          </Link>
          <button onClick={logout} className="bg-white shadow p-4 text-red-500 rounded-xl hover:bg-red-50">
            🚪 Logout
          </button>
        </div>

        {/* ADDRESS FORM */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-bold mb-4">
            {editingId ? "Edit Address" : "Add Address"}
          </h3>

          <div className="grid md:grid-cols-2 gap-3">
            <InputField label="Name" value={newAddress.name} onChange={patch("name")} />
            <InputField label="Phone" value={newAddress.phone} onChange={patch("phone")} />
            <div className="md:col-span-2">
              <InputField label="Address" value={newAddress.addressLine} onChange={patch("addressLine")} />
            </div>
            <InputField label="City" value={newAddress.city} onChange={patch("city")} />
            <InputField label="State" value={newAddress.state} onChange={patch("state")} />
            <InputField label="Pincode" value={newAddress.pincode} onChange={patch("pincode")} />
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            {editingId ? "Update" : "Add"}
          </button>
        </div>

        {/* ADDRESS LIST */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-bold mb-4">Saved Addresses</h3>

          {addresses.length === 0 ? (
            <p className="text-gray-400 text-center">No addresses</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {addresses.map(addr => (
                <div key={addr._id} className="border rounded-xl p-4 hover:shadow transition">

                  <div className="flex justify-between">
                    <h4 className="font-semibold">{addr.name}</h4>
                    {addr.isDefault && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mt-1">{addr.addressLine}</p>
                  <p className="text-sm text-gray-500">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">📞 {addr.phone}</p>

                  <div className="flex gap-2 mt-3">
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addr._id)}
                        className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded"
                      >
                        Default
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setNewAddress(addr);
                        setEditingId(addr._id);
                      }}
                      className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteAddress(addr._id)}
                      className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserProfile;