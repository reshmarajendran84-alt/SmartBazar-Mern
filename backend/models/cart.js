import mongoose from "mongoose";

const cartSchema =new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",require:true},
    items:[
        {
            productId:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},
            quantity:{type:Number,default:1},
            // priceAtAddTIme:{type:Number},
            price: { type: Number }

        },

    ],
    totalAmount:{type:Number,default:0},

},{timestamps:true});

export default mongoose.model("Cart",cartSchema);