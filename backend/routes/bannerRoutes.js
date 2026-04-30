import express from "express";
import upload from "../middlewares/uploads.js";
import {
  createBanner,
  getAllBanners,
  getActiveBanners,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController.js";

const router = express.Router();

// Public — homepage carousel
router.get("/active", getActiveBanners);

// Admin routes (add protect, isAdmin middleware here when ready)
router.get("/", getAllBanners);
router.post("/", upload.single("image"), createBanner);
router.put("/:id", upload.single("image"), updateBanner);
router.delete("/:id", deleteBanner);

export default router;