import mongoose from "mongoose";

const orderSchema =new mongoose.Schema({

    userId:{
        type :mongoose.Schema.Types.ObjectId,
        ref :"User" ,
        require:true
    },
    items:[
        {
            productId :{ type:mongoose.Schema.Types.ObjectId,ref :"Product"},
            name:String,
            quantity :Number,
            price:Number,
        },

    ],
    address: {
      fullName: String,
      phone: String,
      addressLine: String,
      city: String,
      pincode: String,
    },
    subtotal:Number,
    shipping :Number,
    tax:Number,
    total:Number,
    coupon :{type:String,default:""},
    discount:{type:Number,default:0},
    paymentMethod:{type:String,
        enum :["COD","ONLINE"],
        require:true},

    paymentStatus :{type:String,
         enum:["PENDING","PAID","FAILED"],
         default:"PENDING"},

    orderStatus: {
      type: String,
      enum: ["PLACED", "SHIPPED", "DELIVERED"],
      default: "PLACED",
    },
    razorpayOrderId:String,
    razorpayPaymentId:String,
    },{timestamps:true});

export default mongoose.model("Order",orderSchema);