import express from "express";
import upload from "../middlewares/uploads.js";
import {
  createBanner,
  getAllBanners,
  getActiveBanners,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController.js";
import adminProtect from "../middlewares/adminProtect.js";
const router = express.Router();

// Public — homepage carousel
router.get("/active", getActiveBanners);

// Admin routes (add protect, isAdmin middleware here when ready)
router.get("/", getAllBanners);
router.post("/", adminProtect,upload.single("image"), createBanner);
router.put("/:id", adminProtect,upload.single("image"), updateBanner);
router.delete("/:id",adminProtect, deleteBanner);

export default router;