import express from "express";
import {protect} from "../middlewares/authMiddleware.js";
import walletController from "../controllers/walletController.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";

const router = express.Router();

router.get("/",        protect, walletController.getWallet);
router.post("/credit", protect, walletController.creditWallet);
router.post("/debit",  protect, walletController.debitWallet);

router.post("/topup/create", protect, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount < 1)
      return res.status(400).json({ message: "Minimum top-up is ₹1" });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: "wallet_topup_" + Date.now(),
    });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Step 2: Verify and credit wallet
router.post("/topup/verify", protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expected !== razorpay_signature)
      return res.status(400).json({ message: "Payment verification failed" });

    const wallet = await WalletService.creditWallet(
      req.user.id,
      amount,
      `Wallet top-up via Razorpay (${razorpay_payment_id})`
    );
    res.json({ success: true, wallet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;