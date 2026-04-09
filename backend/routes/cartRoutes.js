import express from "express";
import cartController from "../controllers/cartController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, cartController.addToCart);
router.get("/", protect, cartController.getCart);
router.put("/update", protect, cartController.updateCart);
router.delete("/remove", protect, cartController.removeFromCart);
router.post("/merge",  protect, cartController.mergeCart.bind(cartController)); 

export default router;