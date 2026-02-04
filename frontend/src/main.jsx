import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { AuthProvider } from "./context/AuthContext.jsx";
import { AddressProvider } from "./context/AddressContext.jsx";

createRoot(document.getElementById("root")).render(
 <AuthProvider>
    <AddressProvider>
      <App />
    </AddressProvider>
  </AuthProvider>
);
