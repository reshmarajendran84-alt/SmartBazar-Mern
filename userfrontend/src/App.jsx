import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import UserProfile from "./pages/UserProfile";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UserProtectedRoute from "./routes/UserProtectedRoute";
import Footer from "./layouts/Footer";
import Header from "./layouts/Header";
import { ToastContainer } from "react-toastify";
import ProductDetailPage from "./pages/SingleProduct";
import NotFound from "./pages/NotFound";
import CartPage from "./pages/Cart";
import AboutPage from "./pages/About";
import CategoryPage from "./pages/CategoryPage";
import HomePage from "./pages/HomePage";
// import ProductListPage from "./pages/ProductListPage";

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

            <Route element={<UserProtectedRoute />}>
              <Route path="/user/profile" element={<UserProfile />} />
            </Route>
{/* <Route path="/" element={<ProductListPage/>}/> */}
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;