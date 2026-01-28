import express from "express";
import { getProfile, updateProfile, addAddress, updateAddress, deleteAddress } from "../controllers/profileController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);
router.post("/address", authMiddleware, addAddress);
router.put("/address/:addressId", authMiddleware, updateAddress);
router.delete("/address/:addressId", authMiddleware, deleteAddress);

export default router;
