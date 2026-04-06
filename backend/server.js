import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cloudinary from "./config/cloudinary.js";
import razorpay from "./config/razorpay.js";

import noCache from "./middlewares/noCache.js";

import couponRoutes from "./routes/couponRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import addressRoutes from "./routes/AddressRoutes.js";
import publicCategoryRoutes from "./routes/publicCategoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminCartegoryRoutes from "./routes/adminCartegoryRoutes.js";
import adminProtectedRoute from "./routes/adminProductRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dashboardRoutes from "./routes/adminDashboardRoutes.js";
import adminReportRoutes from "./routes/adminReportRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Public routes — no cache blocking needed
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", publicCategoryRoutes);

// ✅ Protected routes — noCache applied to ALL
app.use("/api/user",          noCache, addressRoutes);
app.use("/api/cart",          noCache, cartRoutes);
app.use("/api/order",         noCache, orderRoutes);
app.use("/api/wallet",        noCache, walletRoutes);
app.use("/api/coupon",        noCache, couponRoutes);
app.use("/api/reviews" ,noCache,reviewRoutes);
// ✅ Admin protected routes
app.use("/api/admin",            noCache, adminRoutes);
app.use("/api/admin/categories", noCache, adminCartegoryRoutes);
app.use("/api/admin/products", noCache, adminProtectedRoute);
app.use("/api/admin/coupons",  noCache, couponRoutes);
app.use("/api/admin/orders",   noCache, adminOrderRoutes);
app.use("/api/admin/dashboard", noCache, dashboardRoutes);
app.use("/api/admin/reports" ,noCache, adminReportRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
});