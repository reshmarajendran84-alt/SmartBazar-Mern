import { useEffect, useState } from "react";
import {
  getProfile,
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress
} from "../services/userapi";


import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

useEffect(() => {
  const loadData = async () => {
    try {
      const profileRes = await getProfile();
      const addressRes = await getAddresses();

      setUser(profileRes.data);
      setAddresses(addressRes.data);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  loadData();
}, [navigate]);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>User Profile</h2>
      <p><b>Email:</b> {user.email}</p>

      <h3>Addresses</h3>
      {addresses.length === 0 && <p>No addresses found</p>}

      {addresses.map(addr => (
        <div key={addr._id}>
          <p>{addr.addressLine}</p>
          <p>{addr.city} - {addr.pincode}</p>
          {addr.isDefault && <b>Default</b>}
        </div>
      ))}
    </div>
  );
};

export default Profile;
