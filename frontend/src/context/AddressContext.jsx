import { createContext, useContext, useEffect, useState, useCallback } from "react";
import userApi from "../utils/userApi";
import { useAuth } from "./AuthContext";

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const { user } = useAuth();

  const loadAddresses = useCallback(async () => {
    const res = await userApi.get("/address");
    setAddresses(res.data);
  }, []);

  const addAddress = async (data) => {
    await userApi.post("/address", data);
    loadAddresses();
  };

  const deleteAddress = async (id) => {
    await userApi.delete(`/address/${id}`);
    loadAddresses();
  };

  const setDefaultAddress = async (id) => {
    await userApi.patch(`/address/${id}/default`);
    loadAddresses();
  };

  useEffect(() => {
    if (!user) {
      setAddresses([]);
      return;
    }
    loadAddresses();
  }, [user, loadAddresses]);

  return (
    <AddressContext.Provider
      value={{ addresses, addAddress, deleteAddress, setDefaultAddress }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);
