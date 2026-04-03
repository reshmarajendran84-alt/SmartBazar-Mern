import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import UserProfile from "./pages/UserProfile";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UserProtectedRoute from "./routes/UserProtectedRoute";
import Footer from "./layouts/Footer";
import Header from "./layouts/Header";
import { ToastContainer } from "react-toastify";
import SingleProduct from "./pages/SingleProduct";
import NotFound from "./pages/NotFound";
import CartPage from "./pages/Cart";
import AboutPage from "./pages/About";
import ProductListPage from "./pages/ProductListPage";
import HomePage from "./pages/HomePage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";
import Wallet from "./pages/Wallet";
import OrdersPage from "./pages/OrderPage";
import OrderDetailPage from "./pages/orderDetailPage";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/login" element={<AuthPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/categories" element={<ProductListPage />} />
            <Route path="/products/:id" element={<SingleProduct />} />
            <Route path="/about" element={<AboutPage />} />

            {/* ✅ All protected routes in one block */}
            <Route element={<UserProtectedRoute />}>
              <Route path="/user/profile" element={<UserProfile />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/my-orders" element={<OrdersPage />} />
              <Route path="/wallet" element={<Wallet />} />
  <Route path="/orders/:orderId" element={<OrderDetailPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;