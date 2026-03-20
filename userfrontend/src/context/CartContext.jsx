import React, { createContext, useContext, useState, useEffect } from "react";
import { getCart, addToCart, updateCart, removeFromCart } from "../services/cartService";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) 
      {
        setCart({items:[],totalAmount:0});
          return;} 
    try {
      setLoading(true);
      const res = await getCart();
      setCart(res.data || { items: [], totalAmount: 0 });
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (product) => {
    await addToCart({ productId: product._id, quantity: 1, price: product.price });
    fetchCart();
  };

  const handleUpdate = async (productId, quantity) => {
    await updateCart({ productId, quantity });
    fetchCart();
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, fetchCart, loading, handleAdd, handleUpdate, handleRemove }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);