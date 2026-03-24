import express from "express";
import protect from "../middlewares/authMiddleware.js";
import Wallet from "../models/wallet.js";
 
const router = express.Router();
 
// GET /api/wallet
router.get("/", protect, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      wallet = { balance: 0, transactions: [] };
    }
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch wallet" });
  }
});
 
export default router;