import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// User
import AuthPage from "./pages/auth/AuthPage";
import UserProfile from "./pages/user/UserProfile";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import UserProtectedRoute from "./routes/UserProtectedRoute";
import Navbar from "./layouts/Navbar";

// Admin
import AdminLogin from "./pages/auth/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        {/* ---------- USER ROUTES ---------- */}

        <Route
          path="/auth/login"
          element={
            <>
                          <Navbar />

              <AuthPage />
            </>
          }
        />

        <Route
          path="/auth/forgot-password"
          element={
            <>                          <Navbar />

              <ForgotPasswordPage />
            </>
          }
        />

  <Route
  path="/user/profile"
  element={
    <UserProtectedRoute>
                                <Navbar />

      <UserProfile />
    </UserProtectedRoute>
  }
/>



        {/* ---------- ADMIN ROUTES ---------- */}

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>

        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;