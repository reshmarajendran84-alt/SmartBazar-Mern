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
          image:   { type: String },

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
    paymentMethod: { type: String, enum: ["COD", "ONLINE","WALLET"], required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Paid", "Cancelled", "Returned", "Failed"],
      default: "Pending",
    },
    razorpayOrderId: { 
      type: String, 
      default: null,
      sparse:true
    },
    razorpayPaymentId: { type: String, default: null },
  },
  { timestamps: true }
);

orderSchema.index(
  { razorpayOrderId: 1 },
  { 
    unique: true, 
    partialFilterExpression: { razorpayOrderId: { $type: "string" } } 
  }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
