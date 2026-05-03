import express from "express";
import CouponController from "../controllers/couponController.js";
import adminProtect from "../middlewares/adminProtect.js";
import { protect } from "../middlewares/authMiddleware.js"; 

const router = express.Router();
router.get("/active", protect, CouponController.getActiveCoupons);
router.post("/validate", protect, CouponController.validateCoupon);

router.post("/", adminProtect, CouponController.createCoupon);
router.get("/", adminProtect, CouponController.getCoupons);
router.put("/:id", adminProtect, CouponController.updateCoupon);
router.delete("/:id", adminProtect, CouponController.deleteCoupon);


export default router;