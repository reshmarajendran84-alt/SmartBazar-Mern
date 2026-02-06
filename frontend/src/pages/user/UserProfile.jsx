import { useEffect, useState } from "react";
import userApi from "../../utils/userApi";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newAddress, setNewAddress] = useState({
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    loadData();
  }, []);

 const loadData = async () => {
  try {
    const profileRes = await userApi.get("/profile");
const addressRes = await userApi.get("/address");


    setUser(profileRes.data);
    setAddresses(addressRes.data);
  } catch {
    setError("Failed to load profile");
  } finally {
    setLoading(false);
  }
};

  const handleAdd = async () => {
const res = await userApi.post("/address", newAddress);
  setAddresses(res.data);
};

  const handleDelete = async (id) => {
    try {
await userApi.delete(`/address/${id}`);
      setAddresses(prev => prev.filter(a => a._id !== id));
    } catch {
      setError("Failed to delete address");
    }
  };

  const makeDefault = async (id) => {
    try {
await userApi.patch(`/address/${id}/default`);
      setAddresses(prev =>
        prev.map(a => ({ ...a, isDefault: a._id === id }))
      );
    } catch {
      setError("Failed to update default address");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6">

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          User Profile
        </h2>
        <p className="text-gray-600 mb-6">
          Email: <span className="font-medium">{user.email}</span>
        </p>

        {/* Add Address */}
        <h3 className="text-lg font-semibold mb-4">Add Address</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Address"
            value={newAddress.addressLine}
            onChange={e =>
              setNewAddress({ ...newAddress, addressLine: e.target.value })
            }
          />
          <input
            className="border rounded-lg px-4 py-2"
            placeholder="City"
            value={newAddress.city}
            onChange={e =>
              setNewAddress({ ...newAddress, city: e.target.value })
            }
          />
          <input
            className="border rounded-lg px-4 py-2"
            placeholder="State"
            value={newAddress.state}
            onChange={e =>
              setNewAddress({ ...newAddress, state: e.target.value })
            }
          />
          <input
            className="border rounded-lg px-4 py-2"
            placeholder="Pincode"
            value={newAddress.pincode}
            onChange={e =>
              setNewAddress({ ...newAddress, pincode: e.target.value })
            }
          />
        </div>

        <button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium mb-8"
        >
          Add Address
        </button>

        {/* Address List */}
        <h3 className="text-lg font-semibold mb-4">Saved Addresses</h3>

        {addresses.length === 0 && (
          <p className="text-gray-500">No addresses found</p>
        )}

        <div className="space-y-4">
          {addresses.map(addr => (
            <div
              key={addr._id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-gray-800">
                  {addr.addressLine}, {addr.city},{addr.state},{addr.pincode}
                </p>
                {addr.isDefault && (
                  <span className="text-sm text-green-600 font-semibold">
                    Default ⭐
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  disabled={addr.isDefault}
                  onClick={() => makeDefault(addr._id)}
                  className={`px-3 py-1 rounded-md text-sm font-medium
                    ${
                      addr.isDefault
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                >
                  Set Default
                </button>
                <button
                  onClick={() => handleDelete(addr._id)}
                  className="px-3 py-1 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default UserProfile;