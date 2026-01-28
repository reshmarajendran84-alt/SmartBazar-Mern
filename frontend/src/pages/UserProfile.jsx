import { useEffect, useState } from "react";
import api from "../utils/api";

export default function UserProfile() {
  const [_user, setUser] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ label: "", line1: "", city: "", state: "", country: "", zip: "" });

  // Fetch user
  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      setUser(res.data);
      setName(res.data.name);
      setPhone(res.data.phone);
      setAddresses(res.data.addresses || []);
    } catch (err) {
      console.log(err);
    }
  };

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await api.get("/profile");
      setUser(res.data);
      setName(res.data.name);
      setPhone(res.data.phone);
      setAddresses(res.data.addresses || []);
    } catch (err) {
      console.log(err);
    }
  };

  fetchData();
}, []);


  // Update profile
  const updateProfile = async () => {
    await api.put("/profile", { name, phone });
    fetchProfile();
  };

  // Add address
  const addAddress = async () => {
    await api.post("/profile/address", newAddress);
    setNewAddress({ label: "", line1: "", city: "", state: "", country: "", zip: "" });
    fetchProfile();
  };

  // Delete address
  const deleteAddress = async (id) => {
    await api.delete(`/profile/address/${id}`);
    fetchProfile();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      {/* Basic Info */}
      <div className="mb-6">
        <input value={name} onChange={e => setName(e.target.value)} className="border p-2 mr-2" />
        <input value={phone} onChange={e => setPhone(e.target.value)} className="border p-2 mr-2" />
        <button onClick={updateProfile} className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
      </div>

      {/* Addresses */}
      <h3 className="text-xl font-semibold mb-2">Addresses</h3>
      <ul>
        {addresses.map(addr => (
          <li key={addr._id} className="border p-2 mb-2 flex justify-between items-center">
            <span>{addr.label}: {addr.line1}, {addr.city}, {addr.state}, {addr.country} - {addr.zip}</span>
            <button onClick={() => deleteAddress(addr._id)} className="text-red-600">Delete</button>
          </li>
        ))}
      </ul>

      {/* Add Address */}
      <div className="mt-4 border p-4 rounded space-y-2">
        <input placeholder="Label" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label:e.target.value})} className="border p-2 w-full" />
        <input placeholder="Line 1" value={newAddress.line1} onChange={e => setNewAddress({...newAddress, line1:e.target.value})} className="border p-2 w-full" />
        <input placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city:e.target.value})} className="border p-2 w-full" />
        <input placeholder="State" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state:e.target.value})} className="border p-2 w-full" />
        <input placeholder="Country" value={newAddress.country} onChange={e => setNewAddress({...newAddress, country:e.target.value})} className="border p-2 w-full" />
        <input placeholder="ZIP" value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip:e.target.value})} className="border p-2 w-full" />
        <button onClick={addAddress} className="bg-green-600 text-white px-4 py-2 rounded">Add Address</button>
      </div>
    </div>
  );
}
