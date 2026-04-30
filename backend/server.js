import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cloudinary from "./config/cloudinary.js";
import razorpay from "./config/razorpay.js";

import noCache from "./middlewares/noCache.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import { corsOptions } from "./config/corsConfig.js";
import { generalLimiter, authLimiter, adminLimiter } from "./middlewares/rateLimiter.js";


import couponRoutes from "./routes/couponRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import publicCategoryRoutes from "./routes/publicCategoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import returnRoutes from"./routes/returnRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";
import adminCartegoryRoutes from "./routes/adminCategoryRoutes.js";
import adminProtectedRoute from "./routes/adminProductRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import dashboardRoutes from "./routes/adminDashboardRoutes.js";
import adminReportRoutes from "./routes/adminReportRoutes.js";
import adminReviewsRoutes from "./routes/adminReviewRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(cors(corsOptions));


//  Public routes — no cache blocking needed
app.use("/api/auth", authRoutes,authLimiter);
app.use("/api/products", productRoutes);
app.use("/api/categories", publicCategoryRoutes);
app.use("/api/banners", bannerRoutes);

//  Protected routes — noCache applied to ALL

// app.use("/api/user",          noCache, addressRoutes,generalLimiter);
// app.use("/api/cart",          noCache, cartRoutes,generalLimiter);
// app.use("/api/order",         noCache, orderRoutes,generalLimiter);
// app.use("/api/wallet",        noCache, walletRoutes,generalLimiter);
// app.use("/api/coupon",        noCache, couponRoutes,generalLimiter);
// app.use("/api/reviews" ,noCache,reviewRoutes,generalLimiter);
// app.use("/api/chat",noCache, chatRoutes,generalLimiter);
// app.use("/api/returns", noCache, returnRoutes,generalLimiter);

// //  Admin protected routes

// app.use("/api/admin",            noCache, adminRoutes,adminLimiter);
// app.use("/api/admin/categories", noCache, adminCartegoryRoutes,generalLimiter);
// app.use("/api/admin/products", noCache, adminProtectedRoute,generalLimiter);
// app.use("/api/admin/coupon",  noCache, couponRoutes,generalLimiter);
// app.use("/api/admin/orders",   noCache, adminOrderRoutes,generalLimiter);
// app.use("/api/admin/dashboard", noCache, dashboardRoutes,generalLimiter);
// app.use("/api/admin/reports" ,noCache, adminReportRoutes,generalLimiter)
// app.use("/api/admin/reviews" ,noCache, adminReviewsRoutes,generalLimiter);
// app.use("/api/admin/returns", noCache, returnRoutes,generalLimiter);
// app.use("/api/admin/users", noCache, adminUserRoutes,generalLimiter)
// app.use("/api/admin/banners", noCache, bannerRoutes);


app.use("/api/user",          noCache, userRoutes);
app.use("/api/cart",          noCache, cartRoutes);
app.use("/api/order", noCache, orderRoutes);
app.use("/api/wallet",        noCache, walletRoutes);
app.use("/api/coupon",        noCache, couponRoutes);
app.use("/api/reviews" ,noCache,reviewRoutes);
app.use("/api/chat",noCache, chatRoutes);
app.use("/api/returns", noCache, returnRoutes);
//  Admin protected routes
app.use("/api/admin",            noCache, adminRoutes);
app.use("/api/admin/categories", noCache, adminCartegoryRoutes);
app.use("/api/admin/products", noCache, adminProtectedRoute);
app.use("/api/admin/coupon",  noCache, couponRoutes);
app.use("/api/admin/orders",   noCache, adminOrderRoutes);
app.use("/api/admin/dashboard", noCache, dashboardRoutes);
app.use("/api/admin/reports" ,noCache, adminReportRoutes)
app.use("/api/admin/reviews" ,noCache, adminReviewsRoutes);
app.use("/api/admin/returns", noCache, returnRoutes);
app.use("/api/admin/users", noCache, adminUserRoutes)
app.use("/api/admin/banners", noCache, bannerRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});