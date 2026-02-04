import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./layouts/AdminDashboard";
import UserProfile from "./pages/UserProfile";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProtectedRoute from "./routes/ProtectedRouter";
import Navbar from "./layouts/Navbar";
import { Navigate } from "react-router-dom";
import AdminUsers from "./pages/AdminUsers";

function App() {
  return (
    <BrowserRouter>
    <Navbar/>

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
  <Route path="/profile/address" element={<UserProfile />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute role="user">
              <UserProfile />
            </ProtectedRoute>
          }
        />
                  <Route path="dashboard" element={<AdminUsers />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
