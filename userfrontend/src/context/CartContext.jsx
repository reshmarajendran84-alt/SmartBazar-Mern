import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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

  // ── Fetch cart ───────────────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    if (!isLoggedIn()) {
      const guestItems = getGuestCart();
      setCart({
        items: guestItems,
        totalAmount: guestItems.reduce((s, i) => s + i.price * i.quantity, 0),
      });
      return;
    }
    try {
      setLoading(true);
      const res = await getCart();
      //  backend returns { success, cart } — read res.data.cart
      setCart(res.data?.cart || { items: [], totalAmount: 0 });
    } catch (err) {
      toast.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Merge guest cart on login ────────────────────────────────────────
  const mergeOnLogin = async () => {
    const guestItems = getGuestCart();
    if (guestItems.length > 0) {
      try {
        await mergeCart(guestItems);
        clearGuestCart();
        toast.success("Your cart has been restored!");
      } catch (err) {
        toast.error("Could not merge guest cart");
      }
    }
    await fetchCart();
  };

  // ── Add to cart ──────────────────────────────────────────────────────
  const handleAdd = async (product, quantity = 1) => {
    if (!isLoggedIn()) {
      const updated = addToGuestCart(product, quantity);
      setCart({
        items: updated,
        totalAmount: updated.reduce((s, i) => s + i.price * i.quantity, 0),
      });
      toast.success("Added to cart! 🛒");
      return;
    }

    // Optimistic update
    setCart((prev) => {
      const exists = prev.items.find(
        (i) => (i.productId?._id || i.productId) === product._id
      );
      const updatedItems = exists
        ? prev.items.map((i) =>
            (i.productId?._id || i.productId) === product._id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        : [
            ...prev.items,
            {
              productId: { _id: product._id, name: product.name, images: product.images },
              price: product.price,
              quantity,
            },
          ];
      return {
        items: updatedItems,
        totalAmount: updatedItems.reduce((s, i) => s + i.price * i.quantity, 0),
      };
    });

    toast.success("Added to cart! 🛒");

    try {
      await addToCart({ productId: product._id, quantity, price: product.price });
      await fetchCart(); //  sync real server state
    } catch (err) {
      toast.error("Failed to add to cart");
      await fetchCart(); // rollback
    }
  };

  // ── Update quantity ──────────────────────────────────────────────────
  const handleUpdate = async (productId, quantity) => {
    if (!isLoggedIn()) {
      const updated = updateGuestCart(productId, quantity);
      setCart({
        items: updated,
        totalAmount: updated.reduce((s, i) => s + i.price * i.quantity, 0),
      });
      return;
    }

    // Optimistic update
    setCart((prev) => {
      const updatedItems = prev.items.map((i) =>
        (i.productId?._id || i.productId) === productId ? { ...i, quantity } : i
      );
      return {
        items: updatedItems,
        totalAmount: updatedItems.reduce((s, i) => s + i.price * i.quantity, 0),
      };
    });

    try {
      await updateCart({ productId, quantity });
      await fetchCart(); 
    } catch (err) {
      toast.error("Failed to update cart");
      await fetchCart();
    }
  };

  // ── Remove item ──────────────────────────────────────────────────────
  const handleRemove = async (productId) => {
    if (!isLoggedIn()) {
      const updated = removeFromGuestCart(productId);
      setCart({
        items: updated,
        totalAmount: updated.reduce((s, i) => s + i.price * i.quantity, 0),
      });
      return;
    }

    // Optimistic update
    setCart((prev) => {
      const updatedItems = prev.items.filter(
        (i) => (i.productId?._id || i.productId) !== productId
      );
      return {
        items: updatedItems,
        totalAmount: updatedItems.reduce((s, i) => s + i.price * i.quantity, 0),
      };
    });

    try {
      await removeFromCart(productId);
      await fetchCart(); 
    } catch (err) {
      toast.error("Failed to remove item");
      await fetchCart();
    }
  };

  useEffect(() => { fetchCart(); }, [fetchCart]);

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