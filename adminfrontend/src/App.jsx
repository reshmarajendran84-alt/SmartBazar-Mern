import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import {Toaster} from "react-hot-toast";
import Dashboard from "./pages/AdminDashboard";
import CategoryList from "./pages/Category/CategoryList";
import ProductList from "./pages/Product/ProductList";
import Login from "./pages/AdminLogin";
import ProductDetails from "./pages/Product/ProductDetails";
import CouponPage from "./pages/CouponPage";
function App() {
  return (
    <BrowserRouter>
    <Toaster position="top-right" reverseOrder={false}/>

      <Routes>
        {/* REDIRECT ROOT */}
        <Route path="/" element={<Navigate to="/admin/login" />} />

        {/* LOGIN */}
        <Route path="/admin/login" element={<Login />} />

        {/* ADMIN PANEL */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard/>}/>
          <Route path="products/:id" element={<ProductDetails/>}/>
          <Route path="categories" element={<CategoryList />}/>
          <Route path="products" element={<ProductList />} />
          <Route path="coupons" element={<CouponPage/>}/>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;