import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,

    },
    password: {
      type: String,
      required: null,
    },
    otp: String,
    otpExpiry: Date,
otpLastSent: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
        enum: ["user", "admin"],

      default: "user",
    },
    addresses: [
  {
    name: String,
    phone: String,
    city: String,
    pincode: String,
    addressLine: String
  }
]

  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);