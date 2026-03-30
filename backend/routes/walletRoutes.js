import express from "express";
import protect from "../middlewares/authMiddleware.js";
import walletController from "../controllers/walletController.js";

const router = express.Router();

router.get("/",        protect, walletController.getWallet);
router.post("/credit", protect, walletController.creditWallet);
router.post("/debit",  protect, walletController.debitWallet);
export default router;