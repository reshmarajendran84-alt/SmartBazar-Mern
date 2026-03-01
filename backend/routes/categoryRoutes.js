import express from "express";
import CategoryController from "../controllers/categoryController.js";
import adminProtect from "../middlewares/adminProtect.js";

const router = express.Router();

router.post("/categories", adminProtect, CategoryController.addCategory);
router.get("/categories", adminProtect, CategoryController.getCategory);
router.put("/categories/:id", adminProtect, CategoryController.updateCategory);
router.delete("/categories/:id", adminProtect, CategoryController.deleteCategory);

export default router;