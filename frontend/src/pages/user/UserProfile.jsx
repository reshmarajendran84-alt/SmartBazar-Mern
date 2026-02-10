import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAddress } from "../../context/AddressContext";

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
  setError("");
  setSaving(true);

  try {
    if (
      !newAddress.addressLine ||
      !newAddress.city ||
      !newAddress.state ||
      !/^\d{6}$/.test(newAddress.pincode)
    ) {
      setError("Please fill all fields correctly");
      return;
    }

    if (editingId) {
      await updateAddress(editingId, newAddress);
      setEditingId(null);
    } else {
      await addAddress(newAddress);
    }

    setNewAddress(emptyAddress);
  } catch (err) {
    setError("Something went wrong");
  } finally {
    setSaving(false);
  }
};


  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6">

        <h2 className="text-2xl font-bold mb-2">User Profile</h2>
        <p className="mb-4">
          Email: <b>{user?.email}</b>
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
            className="border rounded p-4 mb-3 flex justify-between"
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
  onClick={() => setDefaultAddress(addr._id)}
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
    await deleteAddress(addr._id);

    if (editingId === addr._id) {
      setEditingId(null);
      setNewAddress(emptyAddress);
      setError("");
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
