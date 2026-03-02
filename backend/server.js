import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cloudinary from "./config/cloudinary.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import addressRoutes from "./routes/AddressRoutes.js";
import cartegoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
// import productPublicRoutes from "./routes/productPublicRoutes.js";

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
app.use("/api/categories",cartegoryRoutes);
app.use("/api/products",productRoutes);

// app.use("/api/products", productPublicRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);