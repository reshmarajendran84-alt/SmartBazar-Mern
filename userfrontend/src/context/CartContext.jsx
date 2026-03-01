import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const exist = cart.find((item) => item.productId === product._id);

    if (exist) {
      const updated = cart.map((item) =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.images[0],
        },
      ]);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

/* ⭐ THIS LINE IS REQUIRED */
export const useCart = () => useContext(CartContext);