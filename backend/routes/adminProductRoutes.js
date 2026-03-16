import express from "express";
import AdminProductController from "../controllers/adminProductController.js";
import adminProtect from "../middlewares/adminProtect.js";
import upload from "../middlewares/uploads.js";
const router = express.Router();

router.post(
  "/",
  adminProtect,
  upload.array("images", 5),
  AdminProductController.createProduct
);

router.get(
  "/",
  adminProtect,
  AdminProductController.getAdminProducts
);
router.get(
  "/:id",
  adminProtect,
  AdminProductController.getSingleProduct
);
router.put(
  "/:id",
  adminProtect,
  upload.array("images", 5),
  AdminProductController.updateProduct
);

router.delete(
  "/:id",
  adminProtect,
  AdminProductController.deleteProduct
);

export default router;