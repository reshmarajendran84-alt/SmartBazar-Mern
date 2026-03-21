import Razorpay from "razorpay";

const razorpay = new Razorpay({
  
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,

});
  console.log("razorpay config loaded",razorpay.options)

export default razorpay;