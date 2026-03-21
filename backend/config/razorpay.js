import Razorpay from "razorpay";
import dotenv from "dotenv";

// dotenv.config(); // ✅ MUST ADD THIS

console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID); // debug
console.log("KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET); // debug

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;