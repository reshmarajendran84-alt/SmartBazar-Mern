import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const exists = await Admin.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (exists) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: hashed,
      role: "admin",
    });

    console.log("Admin created successfully");
    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seedAdmin();
