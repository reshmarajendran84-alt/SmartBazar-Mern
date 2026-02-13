import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// User
import AuthPage from "./pages/AuthPage";
import UserProfile from "./pages/UserProfile";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UserProtectedRoute from "./routes/UserProtectedRoute";

import Footer from "./layouts/Footer";
import Header from "./layouts/Header";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
   <BrowserRouter>

  <ToastContainer
    position="top-right"
    autoClose={3000}
    theme="colored"
  />

  <div className="flex flex-col min-h-screen">
    <Header />

    <main className="flex-grow">
      <Routes>
        <Route path="/auth/login" element={<AuthPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/user/profile"
          element={
            <UserProtectedRoute>
              <UserProfile />
            </UserProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </main>

    <Footer />
  </div>
</BrowserRouter>

  );
}

export default App;
