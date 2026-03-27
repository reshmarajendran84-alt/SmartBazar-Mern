import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    subtotal: Number,
    shipping: Number,
    tax: Number,
    discount: { type: Number, default: 0 },
    total: Number,
    address: {
      fullName: String,
      phone: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
    },
    coupon: { type: String, default: "" },
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Cancelled"],  // ✅ added Cancelled
      default: "Pending",
    },
    razorpayOrderId: {
      type:String,
      default:null,
      sparse:true,
      },
    razorpayPaymentId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);