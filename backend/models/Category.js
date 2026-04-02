import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
name:{
    type :String,
    required:true,
    unique:true,
},
isActive:{
    type:Boolean,
    default:true,
},
  isDeleted: { type: Boolean, default: false }, // ✅ new field

},
  { timestamps: true }
);
export  default mongoose.model("Category",categorySchema);