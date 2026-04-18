import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCart, addToCart, updateCart, removeFromCart, mergeCart,
  getGuestCart, addToGuestCart, updateGuestCart,
  removeFromGuestCart, clearGuestCart,
} from "../services/cartService";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart]       = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  const isLoggedIn = () => !!localStorage.getItem("token");

  const fetchCart = async () => {
    if (!isLoggedIn()) {
      const guestItems = getGuestCart();
      const totalAmount = guestItems.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
      );
      setCart({ items: guestItems, totalAmount });
      return;
    }
    try {
      setLoading(true);
      const res = await getCart();
      setCart(res.data || { items: [], totalAmount: 0 });
    } catch (err) {
      toast.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const mergeOnLogin = async () => {
    const guestItems = getGuestCart();
    if (guestItems.length > 0) {
      try {
        await mergeCart(guestItems);   // POST /cart/merge
        clearGuestCart();              // wipe localStorage
        toast.success("Your cart has been restored!");
      } catch (err) {
        toast.error("Could not merge guest cart");
      }
    }
    await fetchCart();                 // always reload from DB
  };

const handleAdd = async (product, quantity = 1) => {
  if (!isLoggedIn()) {
    const updated = addToGuestCart(product, quantity);
    const totalAmount = updated.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );
    setCart({ items: updated, totalAmount });
    toast.success("Added to cart! 🛒");   // guest toast
    return;
  }
  try {
    await addToCart({ productId: product._id, quantity, price: product.price });
    toast.success("Added to cart! 🛒");   
    fetchCart();
  } catch (err) {
    toast.error("Failed to add to cart");
  }
};
  const handleUpdate = async (productId, quantity) => {
    if (!isLoggedIn()) {
      const updated = updateGuestCart(productId, quantity);
      const totalAmount = updated.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
      );
      setCart({ items: updated, totalAmount });
      return;
    }
    await updateCart({ productId, quantity });
    fetchCart();
  };

  const handleRemove = async (productId) => {
    if (!isLoggedIn()) {
      const updated = removeFromGuestCart(productId);
      const totalAmount = updated.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
      );
      setCart({ items: updated, totalAmount });
      return;
    }
    await removeFromCart(productId);
    fetchCart();
  };

  useEffect(() => { fetchCart(); }, []);

  return (
    <CartContext.Provider value={{
      cart, fetchCart, mergeOnLogin, loading,
      handleAdd, handleUpdate, handleRemove,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);