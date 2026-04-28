import express from "express";
import couponController from "../controllers/couponController.js";
import adminProtect from "../middlewares/adminProtect.js";
import { protect } from "../middlewares/authMiddleware.js"; 

const router = express.Router();
router.post("/validate", protect, couponController.validateCoupon);

router.post("/", adminProtect, couponController.createCoupon);
router.get("/", adminProtect, couponController.getCoupons);
router.put("/:id", adminProtect, couponController.updateCoupon);
router.delete("/:id", adminProtect, couponController.deleteCoupon);


export default router;