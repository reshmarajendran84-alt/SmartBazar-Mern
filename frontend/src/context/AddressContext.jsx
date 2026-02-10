import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
const {user}=useAuth();
  const fetchAddresses = async () => {
    try {
      const res = await api.get("/user/address");
      setAddresses(res.data);
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (data) => {
    const res = await api.post("/user/address", data);
    setAddresses(res.data);
      await fetchAddresses();

  };

  const updateAddress = async (id, data) => {
    const res = await api.put(`/user/address/${id}`, data);
    setAddresses(res.data);
      await fetchAddresses();

  };

  const deleteAddress = async (id) => {
    await api.delete(`/user/address/${id}`);
    setAddresses(prev => prev.filter(a => a._id !== id));
  };

  const setDefaultAddress = async (id) => {
    await api.patch(`/user/address/${id}/default`);
    setAddresses(prev =>
      prev.map(a => ({ ...a, isDefault: a._id === id }))
    );
    await fetchAddresses();
  };

  useEffect(() => {
    if(user){
    fetchAddresses();

    }
  }, [user]);

  return (
    <AddressContext.Provider
      value={{
        addresses,
        loading,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);
