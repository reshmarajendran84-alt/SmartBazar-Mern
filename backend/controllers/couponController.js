import Coupon from "../models/Coupon.js";
class CouponController{

   async createCoupon (req,res){
    try{
        const coupon =await Coupon.create(req.body);
        res.json(coupon);

    }catch(err){
        res.status(500).json({message:"Error creating coupon"});
    }
}
async getCoupons (req,res){
    try{
    const coupon = await Coupon.find();
    res.json(coupon);
    }catch(err){
        res.status(500).json({message:"Error fetching coupons"});
    }
}

async updateCoupon(req,res){
    try{
  const coupon =await Coupon.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    res.json(coupon);
    }catch(err){
        res.status(500).json({message:"Update failed"});
    }
  
}
async deleteCoupon(req,res){
    try{
  const coupon =await Coupon.findByIdAndDelete(req.params.id);
    res.json({message:"Coupon deleted"});
    }catch(err){
        res.status(500).json({message:"Delete failed"});
    }
  
}

 async validateCoupon (req,res){

const {code,subtotal} =req.body;
console.log("request body :",req.body);
  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
console.log("coupon ",coupon);
    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon code" });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: "Coupon is inactive" });
    }

    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({ message: "Coupon expired" });
    }

    if (subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order should be ₹${coupon.minOrderAmount}`,
      });
    }

    const discount = (subtotal * coupon.discountPercent) / 100;

    res.json({
      valid: true,
      discount,
      finalAmount: subtotal - discount,
    });
  } catch (err) {
        console.error("Create coupon error:", err.message);

    res.status(500).json({ message: "Error validating coupon" });
  }
}

}
export default new CouponController();



