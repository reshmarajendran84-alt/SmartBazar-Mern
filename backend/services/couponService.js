import Coupon from "../models/Coupon.js";

class couponService{

   async createCoupon(data){
    return Coupon.create(data);
   }
   async getAllCoupons(){
    return Coupon.find();
   }

   async getActiveCoupons() {
  return Coupon.find({
    isActive: true,
    expiryDate: { $gt: new Date() },
  }).select("code discountPercent minOrderAmount expiryDate");
console.log("Active coupons from DB:", coupons); 
  return coupons;
}

   async updateCoupon(id,data){
    return Coupon.findByIdAndUpdate(id,data,{new:true});
   }
   async deleteCoupon(id){
    return Coupon.findByIdAndDelete(id);
   }
   async validateCoupon(code,subtotal) {
   const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) throw new Error("Invalid coupon code");
    if (!coupon.isActive) throw new Error("Coupon inactive");
    if (coupon.expiryDate < new Date()) throw new Error("Coupon expired");
    if (subtotal < coupon.minOrderAmount)
      throw new Error(`Minimum order ₹${coupon.minOrderAmount}`);
    const discount = (subtotal * coupon.discountPercent) / 100;
   console.log("subtotal:", subtotal);
    console.log("discountPercent:", coupon.discountPercent);
    console.log("discount:", discount);
    return {valid:true, discount, finalAmount: subtotal - discount };
  }
}
export default new couponService();
