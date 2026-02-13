import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { AuthProvider } from "./context/AuthContext.jsx";
import { AddressProvider } from "./context/AddressContext.jsx";
import { StrictMode } from "react";

createRoot(document.getElementById("root")).render(
 <StrictMode>
 <AuthProvider>
    <AddressProvider>
      <App />
    </AddressProvider>
  </AuthProvider>
 </StrictMode>

);
