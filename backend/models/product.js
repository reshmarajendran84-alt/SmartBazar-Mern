import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    price: {
      type: Number,
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

    isActive: {
      type: Boolean,
      default: true,
    },

  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
