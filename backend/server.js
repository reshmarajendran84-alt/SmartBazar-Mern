import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import addressRoutes from "./routes/AddressRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/user", addressRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);