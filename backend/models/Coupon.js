import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code:{
            type:String,
            require:true,
            unique:true,
            upperCase:true,
            trim:true,
        },
        discountPercent:{
            type:Number,
            require:true,
        },
        expiryDate:{
            type:Date,
            require:true,
        },
        minOrderAmount:{
            type:Number,
            default:0,
        },
        isActive:{
            type:Boolean,
            default:true,

        },

    },
    {timestamps:true}
);

export default mongoose.model("Coupon",couponSchema);
