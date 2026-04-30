import Coupon from "../models/Coupon.js";
import couponService from "../services/couponService.js";

class CouponController {
  async createCoupon(req, res) {
    try {
      if (req.body.code) req.body.code = req.body.code.toUpperCase();
      const coupon = await couponService.createCoupon(req.body);
      res.json(coupon);
    } catch (err) {
      res.status(500).json({ message: "Error creating coupon" });
    }
  }

  async getCoupons(req, res) {
    try {
      const coupons = await couponService.getAllCoupons();
      res.json(coupons);
    } catch (err) {
      res.status(500).json({ message: "Error fetching coupons" });
    }
  }

  async updateCoupon(req, res) {
    try {
      if (req.body.code) req.body.code = req.body.code.toUpperCase();
      const coupon = await couponService.updateCoupon(req.params.id, req.body);
      res.json(coupon);
    } catch (err) {
      res.status(500).json({ message: "Update failed" });
    }
  }

  async deleteCoupon(req, res) {
    try {
      await couponService.deleteCoupon(req.params.id);
      res.json({ message: "Coupon deleted" });
    } catch (err) {
      res.status(500).json({ message: "Delete failed" });
    }
  }

  async validateCoupon(req, res) {
    try {
      const { code, subtotal } = req.body;
      if (!code) return res.status(400).json({ message: "Coupon code required" });
      if (isNaN(Number(subtotal))) return res.status(400).json({ message: "Invalid subtotal" });

      // ✅ delegates to service
      const result = await couponService.validateCoupon(code, Number(subtotal));
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}


export default new CouponController();