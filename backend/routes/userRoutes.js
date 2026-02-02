import express from "express";
import userController from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, userController.getProfile);
router.put("/profile", protect, userController.updateProfile);

router.get("/address", protect, userController.getAddresses);
router.post("/address", protect, userController.addAddress);
router.put("/address/:id", protect, userController.updateAddress);
router.delete("/address/:id", protect, userController.deleteAddress);
router.patch("/address/:id/default", protect, userController.setDefaultAddress);

export default router;
