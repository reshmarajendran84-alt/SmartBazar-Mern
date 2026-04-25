import { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // Keep only cart-adjacent or global UI state here.
  // Product fetching is handled by ProductListPage via useSearchParams.
  const [wishlist, setWishlist] = useState([]);

  return (
    <ProductContext.Provider value={{ wishlist, setWishlist }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);