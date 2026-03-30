import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cloudinary from "./config/cloudinary.js";
import razorpay from "./config/razorpay.js";


import couponRoutes from "./routes/couponRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import addressRoutes from "./routes/AddressRoutes.js";
import publicCategoryRoutes from "./routes/publicCategoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminCartegoryRoutes from "./routes/adminCartegoryRoutes.js";
import adminProtectedRoute from "./routes/adminProductRoutes.js"
import orderRoutes from "./routes/orderRoutes.js";
// import walletRoutes from "./routes/walletRoutes.js";
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/user", addressRoutes);

app.use("/api/products",productRoutes);
app.use("/api/categories",publicCategoryRoutes);
 
app.use("/api/admin/categories",adminCartegoryRoutes);
app.use("/api/admin/products",adminProtectedRoute);

app.use("/api/cart", cartRoutes);
app.use("/api/admin/coupons",couponRoutes)
app.use("/api/coupon",couponRoutes)


app.use("/api/order",orderRoutes);
// app.use("/api/wallet",walletRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`);
  console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID); // debug

});