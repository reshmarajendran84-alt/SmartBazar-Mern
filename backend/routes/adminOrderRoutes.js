import express from "express";
import AdminOrderController from "../controllers/adminOrderControler.js";
import adminProtect from "../middlewares/adminProtect.js";

const router = express.Router();

router.get("/stats",      adminProtect, (req, res) => AdminOrderController.getOrderStats(req, res));
router.get("/",           adminProtect, (req, res) => AdminOrderController.getAllOrders(req, res));
router.get("/:id",        adminProtect, (req, res) => AdminOrderController.getOrderById(req, res));
router.put("/:id/status", adminProtect, (req, res) => AdminOrderController.updateOrderStatus(req, res));

export default router;