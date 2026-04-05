// routes/adminReportRoutes.js
import express from "express";
import adminProtect from "../middlewares/adminProtect.js";
import ReportController from "../controllers/adminReportController.js";

const router = express.Router();

// GET /api/admin/reports/sales?startDate=2024-01-01&endDate=2024-12-31
router.get("/sales", adminProtect, ReportController.getSalesReport);

export default router;