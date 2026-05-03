import express from "express";
import adminProtect from "../middlewares/adminProtect.js";
import DashboardController from "../controllers/adminDashboardController.js";

const router = express.Router();

router.get("/stats", adminProtect, DashboardController.getDashboardStats);

export default router;