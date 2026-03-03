import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      },
 price: {
      type: Number,
      required: true,
    
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
      
    },

images: [String],

    description: {
      type: String,
    },

  
    isActive: {
      type: Boolean,
      default: true,
    },
  // discount: {
    //   type: Number,
    //   default: 0,
    // },

    // rating: {
    //   type: Number,
    //   default: 0,
    //   min:0,
    //   max:5,
    // },

    // numReviews: {
    //   type: Number,
    //   default: 0,
    // },

  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
