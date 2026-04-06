import mongoose from "mongoose";
const reviewSchema =new mongoose.Schema(
{
    userId :{ type: mongoose.Schema.Types.ObjectId,ref:"User",require:true},
    productId :{type:mongoose.Schema.Types.ObjectId,ref:"Product" ,require:true},
    orderId :{type:mongoose.Schema.Types.ObjectId,ref:"Order" ,require:true},
    rating :{type:Number,require:true,min:1,max:5},
    Comment:{type:String,trim:true,maxlength:500},
    isVerified:{type:Boolean,default:true},


},
{timestamps:true}
);

reviewSchema.index({userId:1, productId:1},{unique:true});
export default reviewSchema;