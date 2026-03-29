// models/order.js
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
      fullName: { type: String, default: "" },
      phone: { type: String, default: "" },
      addressLine: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
    coupon: { type: String, default: "" },
    paymentMethod: { type: String, enum: ["COD", "ONLINE"], required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Paid", "Cancelled", "Returned", "Failed"],
      default: "Pending",
    },
    // ✅ FIX: Remove unique constraint or use conditional unique
    razorpayOrderId: { 
      type: String, 
      default: null,
      sparse:true
      // Remove 'unique: true' or use partial filter expression
    },
    razorpayPaymentId: { type: String, default: null },
  },
  { timestamps: true }
);

// ✅ Better approach: Create a partial unique index (MongoDB 3.2+)
// This allows multiple null values but enforces uniqueness for non-null values
orderSchema.index(
  { razorpayOrderId: 1 },
  { 
    unique: true, 
    partialFilterExpression: { razorpayOrderId: { $type: "string" } } 
  }
);

export default mongoose.model("Order", orderSchema);