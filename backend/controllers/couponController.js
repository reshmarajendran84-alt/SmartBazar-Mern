import Coupon from "../models/Coupon.js";

class CouponController {

  async createCoupon(req, res) {
    try {
      if (req.body.code) req.body.code = req.body.code.toUpperCase();
      const coupon = await Coupon.create(req.body);
      res.json(coupon);
    } catch (err) {
      res.status(500).json({ message: "Error creating coupon" });
    }
  }

  async getCoupons(req, res) {
    try {
      const coupons = await Coupon.find();
      res.json(coupons);
    } catch (err) {
      res.status(500).json({ message: "Error fetching coupons" });
    }
  }

  async updateCoupon(req, res) {
    try {
      if (req.body.code) req.body.code = req.body.code.toUpperCase();
      const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(coupon);
    } catch (err) {
      res.status(500).json({ message: "Update failed" });
    }
  }

  async deleteCoupon(req, res) {
    try {
      await Coupon.findByIdAndDelete(req.params.id);
      res.json({ message: "Coupon deleted" });
    } catch (err) {
      res.status(500).json({ message: "Delete failed" });
    }
  }

  async validateCoupon(req, res) {
    try {
      const { code, subtotal } = req.body;
      const subtotalNum = Number(subtotal);

      console.log("code:", code, "subtotal:", subtotal, "subtotalNum:", subtotalNum);

      if (!code) {
        return res.status(400).json({ message: "Coupon code required" });
      }

      if (isNaN(subtotalNum)) {
        return res.status(400).json({ message: "Invalid subtotal" });
      }

      const coupon = await Coupon.findOne({ code: code.toUpperCase() });

      if (!coupon) {
        return res.status(400).json({ message: "Invalid coupon code" });
      }

      if (!coupon.isActive) {
        return res.status(400).json({ message: "Coupon is inactive" });
      }

      if (coupon.expiryDate < new Date()) {
        return res.status(400).json({ message: "Coupon expired" });
      }

      if (subtotalNum < coupon.minOrderAmount) {
        return res.status(400).json({
          message: `Minimum order should be ₹${coupon.minOrderAmount}`,
        });
      }

      const discount = (subtotalNum * coupon.discountPercent) / 100;

      res.json({
        valid: true,
        discount,
        finalAmount: subtotalNum - discount,
      });

    } catch (err) {
      console.error("validateCoupon error:", err.message);
      res.status(500).json({ message: "Error validating coupon" });
    }
  }
}

export default new CouponController();