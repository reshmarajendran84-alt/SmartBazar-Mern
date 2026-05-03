import mongoose from "mongoose";

const cartSchema =new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    items:[
        {
            productId:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},
            quantity:{type:Number,
                default:1},
            name:{type:String,
                default:""},
            image:{type:String,
                default:null},
            price: { type: Number },

        },

    ],
    totalAmount:{type:Number,default:0},

},{timestamps:true});

export default mongoose.model("Cart",cartSchema);