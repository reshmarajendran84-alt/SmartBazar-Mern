import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getCart, addToCart, updateCart, removeFromCart, mergeCart,
  getGuestCart, addToGuestCart, updateGuestCart,
  removeFromGuestCart, clearGuestCart,
} from "../services/cartService";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  const isLoggedIn = () => !!localStorage.getItem("token");

  // Fetch cart from server or localStorage
  const fetchCart = useCallback(async () => {
    if (!isLoggedIn()) {
      const guestItems = getGuestCart();
      setCart({
        items: guestItems,
        totalAmount: guestItems.reduce((s, i) => s + (i.price * i.quantity), 0),
      });
      return;
    }
    try {
      setLoading(true);
      const res = await getCart();
      const cartData = res.data?.cart || { items: [], totalAmount: 0 };
      
      // Ensure cart items have consistent structure
      const normalizedItems = (cartData.items || []).map(item => ({
        ...item,
        productId: item.productId?._id ? item.productId : { _id: item.productId, name: item.name, images: item.image ? [item.image] : [] },
        price: item.price || 0,
        quantity: item.quantity || 1,
      }));
      
      setCart({ ...cartData, items: normalizedItems });
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      if (err.response?.status !== 401) {
        toast.error("Failed to load cart");
      }
      setCart({ items: [], totalAmount: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  // Merge guest cart on login
  const mergeOnLogin = async () => {
    const guestItems = getGuestCart();
    if (guestItems.length > 0) {
      try {
        await mergeCart(guestItems);
        clearGuestCart();
        toast.success("Your cart has been restored!");
      } catch (err) {
        console.error("Failed to merge cart:", err);
        toast.error("Could not restore your cart");
      }
    }
    await fetchCart();
  };

  // Add item to cart
  const handleAdd = async (product, quantity = 1) => {
    if (!product?._id) {
      toast.error("Invalid product");
      return;
    }

    // Guest user
    if (!isLoggedIn()) {
      const updated = addToGuestCart(product, quantity);
      setCart({
        items: updated,
        totalAmount: updated.reduce((s, i) => s + (i.price * i.quantity), 0),
      });
      toast.success("Added to cart! 🛒");
      return;
    }

    // Optimistic update for logged in user
    const productId = product._id;
    const existingItem = cart.items.find(
      (i) => (i.productId?._id || i.productId) === productId
    );

    let updatedItems;
    if (existingItem) {
      updatedItems = cart.items.map((i) =>
        (i.productId?._id || i.productId) === productId
          ? { ...i, quantity: i.quantity + quantity }
          : i
      );
    } else {
      updatedItems = [
        ...cart.items,
        {
          productId: { 
            _id: product._id, 
            name: product.name, 
            images: product.images || [] 
          },
          price: product.price,
          quantity: quantity,
          name: product.name,
          image: product.images?.[0] || "",
        },
      ];
    }

    const newTotalAmount = updatedItems.reduce((s, i) => s + (i.price * i.quantity), 0);
    
    // Optimistic update
    setCart({
      items: updatedItems,
      totalAmount: newTotalAmount,
    });

    toast.success("Added to cart! 🛒");

    try {
      await addToCart({ 
        productId: product._id, 
        quantity, 
        price: product.price,
        name: product.name,
        image: product.images?.[0] || ""
      });
      await fetchCart(); // Sync with server
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error("Failed to add to cart");
      await fetchCart(); // Rollback
    }
  };

  // Update item quantity
  const handleUpdate = async (productId, quantity) => {
    if (quantity < 1) {
      handleRemove(productId);
      return;
    }

    // Guest user
    if (!isLoggedIn()) {
      const updated = updateGuestCart(productId, quantity);
      setCart({
        items: updated,
        totalAmount: updated.reduce((s, i) => s + (i.price * i.quantity), 0),
      });
      return;
    }

    // Optimistic update for logged in user
    const updatedItems = cart.items.map((i) =>
      (i.productId?._id || i.productId) === productId ? { ...i, quantity } : i
    );
    
    setCart({
      items: updatedItems,
      totalAmount: updatedItems.reduce((s, i) => s + (i.price * i.quantity), 0),
    });

    try {
      await updateCart({ productId, quantity });
      await fetchCart();
    } catch (err) {
      console.error("Failed to update cart:", err);
      toast.error("Failed to update quantity");
      await fetchCart();
    }
  };

  // Remove item from cart
  const handleRemove = async (productId) => {
    // Guest user
    if (!isLoggedIn()) {
      const updated = removeFromGuestCart(productId);
      setCart({
        items: updated,
        totalAmount: updated.reduce((s, i) => s + (i.price * i.quantity), 0),
      });
      toast.info("Item removed from cart");
      return;
    }

    // Optimistic update for logged in user
    const updatedItems = cart.items.filter(
      (i) => (i.productId?._id || i.productId) !== productId
    );
    
    setCart({
      items: updatedItems,
      totalAmount: updatedItems.reduce((s, i) => s + (i.price * i.quantity), 0),
    });


    try {
      await removeFromCart(productId);
      await fetchCart();
      toast.success("Item removed from cart");
    } catch (err) {
      console.error("Failed to remove item:", err);
      toast.error("Failed to remove item");
      await fetchCart();
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    if (!isLoggedIn()) {
      clearGuestCart();
      setCart({ items: [], totalAmount: 0 });
      toast.info("Cart cleared");
      return;
    }

    try {
      for (const item of cart.items) {
        const productId = item.productId?._id || item.productId;
        await removeFromCart(productId);
      }
      await fetchCart();
      toast.info("Cart cleared");
    } catch (err) {
      console.error("Failed to clear cart:", err);
      toast.error("Failed to clear cart");
    }
  };

  // Get cart item count
  const getCartCount = useCallback(() => {
    return cart.items.reduce((count, item) => count + (item.quantity || 0), 0);
  }, [cart.items]);

  // Get cart total
  const getCartTotal = useCallback(() => {
    return cart.totalAmount;
  }, [cart.totalAmount]);

  useEffect(() => { 
    fetchCart(); 
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      fetchCart,
      mergeOnLogin,
      handleAdd,
      handleUpdate,
      handleRemove,
      handleClearCart,
      getCartCount,
      getCartTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};