import express from "express";
import CartController from "../controllers/cartController.js";
import {protect} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, CartController.addToCart);
router.get("/", protect, CartController.getCart);
router.put("/update", protect, CartController.updateCart);
router.delete("/remove", protect, CartController.removeFromCart);
router.post("/merge",  protect, CartController.mergeCart.bind(CartController)); 

export default router;