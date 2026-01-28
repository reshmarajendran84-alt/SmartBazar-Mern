import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectRoute";
import UserProfile from "./pages/UserProfile";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage  />} />        <Route path="/profile" element={
          <ProtectedRoute role="user">
            <UserProfile />
          </ProtectedRoute>
        } />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
