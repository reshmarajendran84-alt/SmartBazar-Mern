import express from "express";
import CategoryController from "../controllers/categoryController.js";
import adminProtect from "../middlewares/adminProtect.js";

const router = express.Router();

router.post("/",      adminProtect, CategoryController.addCategory.bind(CategoryController));
router.get("/",       adminProtect, CategoryController.getCategory.bind(CategoryController));
router.put("/:id",    adminProtect, CategoryController.updateCategory.bind(CategoryController));
router.delete("/:id", adminProtect, CategoryController.deleteCategory.bind(CategoryController));
router.patch("/:id/toggle-status", adminProtect, CategoryController.toggleCategoryStatus.bind(CategoryController)); 

export default router;