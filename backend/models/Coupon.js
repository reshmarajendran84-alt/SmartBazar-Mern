import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code:{
            type:String,
            required:true,
            unique:true,
            upperCase:true,
            trim:true,
        },
        discountPercent:{
            type:Number,
            required:true,
        },
        expiryDate:{
            type:Date,
            required:true,
        },
        minOrderAmount:{
            type:Number,
            default:0,
        },
         usedCount:
          { type: Number,
             default: 0 },
        isActive:{
            type:Boolean,
            default:true,

        },

    },
    {timestamps:true}
);

export default mongoose.model("Coupon",couponSchema);
