import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add product to cart
  const handleAddToCart = (product) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = storedCart.find((item) => item.productId === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      storedCart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(storedCart));
    setCart(storedCart);
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = storedCart.filter((item) => item.productId !== productId);

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  return (
    <CartContext.Provider value={{ cart, handleAddToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => useContext(CartContext);