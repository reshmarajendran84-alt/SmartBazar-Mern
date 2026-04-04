import express from "express";
import { getDashboardStats } from "../controllers/adminDashboardController.js";
import adminProtect from "../middlewares/adminProtect.js";

const router = express.Router();

router.get("/stats", adminProtect, getDashboardStats);

export default router;