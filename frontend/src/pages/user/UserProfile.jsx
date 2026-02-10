import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAddress } from "../../context/AddressContext";

const UserProfile = () => {
  const { user } = useAuth();
  const {
    addresses,
    loading,
    addAddress,
    deleteAddress,
    setDefaultAddress
  } = useAddress();

  const [newAddress, setNewAddress] = useState({
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });
console.log("hiii");
  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6">

        <h2 className="text-2xl font-bold mb-2">User Profile</h2>
        <p className="mb-6">
          Email: <b>{user.email}</b>
        </p>

        {/* ADD */}
        <h3 className="text-lg font-semibold mb-3">Add Address</h3>

        <div className="grid md:grid-cols-2 gap-3 mb-4">
          {["addressLine", "city", "state", "pincode"].map(field => (
            <input
              key={field}
              placeholder={field}
              className="border px-3 py-2 rounded"
              value={newAddress[field]}
              onChange={e =>
                setNewAddress({ ...newAddress, [field]: e.target.value })
              }
            />
          ))}
        </div>

        <button
          onClick={() => addAddress(newAddress)}
          className="bg-indigo-600 text-white px-5 py-2 rounded mb-6"
        >
          Add Address
        </button>

        {/* READ */}
        <h3 className="text-lg font-semibold mb-3">Saved Addresses</h3>

        {addresses.length === 0 && <p>No addresses found</p>}

        {addresses.map(addr => (
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
                disabled={addr.isDefault}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Set Default
              </button>

              <button
                onClick={() => deleteAddress(addr._id)}
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
