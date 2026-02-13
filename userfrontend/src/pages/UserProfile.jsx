import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAddress } from "../context/AddressContext";
import { toast } from "react-toastify";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, setUser, setLoading } = useAuth();

  const {
    addresses,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddress();

  const emptyAddress = {
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  };

  const [newAddress, setNewAddress] = useState(emptyAddress);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
const [saving, setSaving] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setLoading(false);
    navigate("/auth/login");
  }, [navigate, setUser, setLoading]);

 const handleSubmit = async () => {
  if (!newAddress.addressLine)
    return toast.warning("Address is required");

  if (!newAddress.city)
    return toast.warning("City is required");

  if (!newAddress.state)
    return toast.warning("State is required");

  if (!/^\d{6}$/.test(newAddress.pincode))
    return toast.warning("Enter valid 6-digit pincode");

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



  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
<div className="min-h-[calc(100vh-140px)] bg-gray-100 py-10 px-4">
  <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">

      <h2 className="text-3xl font-bold text-gray-800 mb-2">
  User Profile
</h2>
<p className="text-gray-600 mb-6">
  Email: <span className="font-semibold">{user?.email}</span>
</p>


      

        <h3 className="text-lg font-semibold mb-3">
          {editingId ? "Edit Address" : "Add Address"}
        </h3>

        <div className="grid md:grid-cols-2 gap-3 mb-2">
          {["addressLine", "city", "state"].map((field) => (
            <input
              key={field}
              placeholder={field}
              className="border px-3 py-2 rounded"
              value={newAddress[field]}
              onChange={(e) =>
                setNewAddress({ ...newAddress, [field]: e.target.value })
              }
            />
          ))}

          <input
            type="text"
            placeholder="Pincode"
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
    onClick={() => {
      setEditingId(null);
      setNewAddress(emptyAddress);
      setError("");
    }}
    className="ml-3 text-gray-600 underline"
  >
    Cancel
  </button>
)}

        {addresses.length === 0 && <p>No addresses found</p>}

        {addresses.map((addr) => (
    <div
  key={addr._id}
  className="bg-gray-50 rounded-xl p-4 mb-4 
             flex flex-col md:flex-row 
             md:items-center md:justify-between gap-4"
>

            <div>
              <p>
                {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
              {addr.isDefault && (
                <span className="text-green-600 text-sm">Default ⭐</span>
              )}
            </div>

            <div className="flex gap-2">
<button
  onClick={async () => {
    try {
      await setDefaultAddress(addr._id);
      toast.success("Default address updated ⭐");
    } catch (error) {
      toast.error("Failed to set default address ❌");
    }
  }}
  disabled={addr.isDefault || editingId}
  className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
>
  Set Default
</button>



              <button
                onClick={() => {
                  setNewAddress({
                    addressLine: addr.addressLine,
                    city: addr.city,
                    state: addr.state,
                    pincode: addr.pincode,
                  });
                  setEditingId(addr._id);
                }} 
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>

   <button
  onClick={async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmDelete) return;

    try {
      await deleteAddress(addr._id);
      toast.success("Address deleted successfully 🗑️");

      if (editingId === addr._id) {
        setEditingId(null);
        setNewAddress(emptyAddress);
        setError("");
      }
    } catch (error) {
      toast.error("Failed to delete address ❌");
    }
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
