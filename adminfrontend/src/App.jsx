import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/Admin/AdminLogin";
import AdminLayout from "./Layout/AdminLayout";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";

import { CategoryProvider } from "./context/CategoryContext";
import CategoryPage from "./components/Category/CategoryPage";

import { ProductProvider } from "./context/ProductContext";
import ProductPage from "./components/Product/ProductPage";

function App() {
  return (
    <BrowserRouter>
      <ProductProvider>
        <CategoryProvider>

          <Routes>

            <Route path="/" element={<Navigate to="/admin/login" />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>

                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="categories" element={<CategoryPage />} />

                {/* ✅ ONLY THIS */}
<Route path="/admin/products" element={<ProductPage />} />

              </Route>
            </Route>

          </Routes>

        </CategoryProvider>
      </ProductProvider>
    </BrowserRouter>
  );
}

export default App;
