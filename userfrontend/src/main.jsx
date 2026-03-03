import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { AuthProvider } from "./context/AuthContext.jsx";
import { AddressProvider } from "./context/AddressContext.jsx";
import { StrictMode } from "react";
import { CategoryProvider } from "./context/CategoryContext.jsx";

import { ProductProvider } from "./context/ProductContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <AddressProvider>
        <CategoryProvider>
          <CartProvider>
            <ProductProvider>
              <App />
            </ProductProvider>
          </CartProvider>
        </CategoryProvider>
      </AddressProvider>
    </AuthProvider>
  </StrictMode>,
);
