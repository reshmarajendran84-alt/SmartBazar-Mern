import express from "express";
import adminProtect from "../middlewares/adminProtect.js";
import dashboardController from "../controllers/adminDashboardController.js";

const router = express.Router();

router.get("/stats", adminProtect, dashboardController.getDashboardStats);

export default router;