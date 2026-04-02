import express from "express";
import categoryController from "../controllers/categoryController.js";
import adminProtect from "../middlewares/adminProtect.js";

const router = express.Router();

// ✅ .bind() on ALL routes
router.post("/",      adminProtect, categoryController.addCategory.bind(categoryController));
router.get("/",       adminProtect, categoryController.getCategory.bind(categoryController));
router.put("/:id",    adminProtect, categoryController.updateCategory.bind(categoryController));
router.delete("/:id", adminProtect, categoryController.deleteCategory.bind(categoryController));
router.patch("/:id/toggle-status", adminProtect, categoryController.toggleCategoryStatus.bind(categoryController)); // ✅

export default router;