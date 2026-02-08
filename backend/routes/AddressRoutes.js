import express from "express";
import UserController from "../controllers/UserController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/profile", protect, UserController.getProfile);
router.put("/profile", protect, UserController.updateProfile);

router.get("/address", protect, UserController.getAddresses);
router.post("/address", protect, UserController.addAddress);
router.put("/address/:id", protect, UserController.updateAddress);
router.delete("/address/:id", protect, UserController.deleteAddress);
router.patch("/address/:id/default", protect, UserController.setDefaultAddress);


export default router;