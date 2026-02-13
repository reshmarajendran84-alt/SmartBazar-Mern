import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./Layout/AdminLayout";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/admin/login" />} />

        {/* 🔓 Public Login (NO layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 🔐 Protected Admin Area */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
