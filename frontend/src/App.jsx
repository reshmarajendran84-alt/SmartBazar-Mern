import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// User
import AuthPage from "./pages/AuthPage";
import UserProfile from "./pages/UserProfile";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProtectedRoute from "./routes/ProtectedRouter";
import Navbar from "./layouts/Navbar";

// Admin
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- USER ROUTES ---------- */}

        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <AuthPage />
            </>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <>
              <Navbar />
              <ForgotPasswordPage />
            </>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute role="user">
              <>
                <Navbar />
                <UserProfile />
              </>
            </ProtectedRoute>
          }
        />

        {/* ---------- ADMIN ROUTES ---------- */}

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>

        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
