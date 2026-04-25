import express from "express";
import AdminOrderController from "../controllers/adminOrderControler.js";
import adminProtect from "../middlewares/adminProtect.js";
import adminController from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats",      adminProtect,  AdminOrderController.getOrderStats);
router.get("/",           adminProtect,  AdminOrderController.getAllOrders);
router.get("/:id",        adminProtect,  AdminOrderController.getOrderById);
router.get("/:id/invoice",         adminProtect, AdminOrderController.downloadInvoice); // ← ADD THIS

router.put("/:id/status", adminProtect,  AdminOrderController.updateOrderStatus);
router.post("/:id/approve-return", adminProtect, AdminOrderController.approveReturn); 
router.post("/:id/rejectReturn",adminProtect ,AdminOrderController.rejectReturn);
export default router;
