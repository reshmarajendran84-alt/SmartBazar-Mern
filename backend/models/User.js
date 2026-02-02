import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  addressLine: String,
  city: String,
  state: String,
  pincode: String,
  country: { type: String, default: "India" },
  isDefault: { type: Boolean, default: false }
});

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
    addresses: [addressSchema]

  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);