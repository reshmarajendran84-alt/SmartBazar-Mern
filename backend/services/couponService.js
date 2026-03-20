import Coupon from "../models/Coupon";

class couponService{

   async createCoupon(data){
    return Coupon.create(data);
   }
   async getAllCoupons(){
    return Coupon.find();
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
    return { discount, finalAmount: subtotal - discount };
  }
}
export default new couponService();
