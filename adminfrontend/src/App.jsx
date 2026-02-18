import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/Admin/AdminLogin";
import AdminLayout from "./Layout/AdminLayout";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";

import { CategoryProvider } from "./context/CategoryContext";
import CategoryPage from "./pages/CategoryPage";

import { ProductProvider } from "./context/ProductContext";
import ProductList from "./components/Product/ProductList";
import ProductEdit from "./components/Product/ProductEdit";

function App() {
  return (
    <BrowserRouter>
<ProductProvider>

      <CategoryProvider>

        <Routes>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/admin/login" />} />

          {/* Public Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route element={<AdminProtectedRoute />}>

            <Route path="/admin" element={<AdminLayout />}>

              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
<Route path ="categories" element={<CategoryPage/>}/>
           
           <Route path="products" element={<ProductList />} />
<Route path="products/create" element={<ProductList />} />
<Route path="products/edit/:id" element={<ProductEdit />} />

            </Route>

          </Route>
<Route element={<AdminProtectedRoute />}>

  <Route path="/admin" element={<AdminLayout />}>

<Route index element={<AdminDashboard />} />
    <Route path="dashboard" element={<AdminDashboard />} />

    <Route path="users" element={<AdminUsers />} />

    <Route path="categories" element={<CategoryPage />} />

    <Route path="products" element={<ProductList />} />
    <Route path="products/create" element={<ProductList />} />
    <Route path="products/edit/:id" element={<ProductEdit />} />

  </Route>

</Route>

        </Routes>

      </CategoryProvider>
</ProductProvider>

    </BrowserRouter>
  );
}

export default App;
