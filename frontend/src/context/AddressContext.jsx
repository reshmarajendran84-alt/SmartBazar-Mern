import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../utils/api";

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);

  const loadAddresses = useCallback(async () => {
    const res = await api.get("/user/address");
    setAddresses(res.data);
  }, []);

  const addAddress = async (data) => {
    await api.post("/user/address", data);
    loadAddresses();
  };

  const deleteAddress = async (id) => {
    await api.delete(`/user/address/${id}`);
    loadAddresses();
  };

  const setDefaultAddress = async (id) => {
    await api.patch(`/user/address/${id}/default`);
    loadAddresses();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      await loadAddresses();
    })();
  }, [loadAddresses]);

  return (
    <AddressContext.Provider
      value={{ addresses, addAddress, deleteAddress, setDefaultAddress }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);
