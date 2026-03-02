import express from "express";
import CategoryController from "../controllers/categoryController.js";
import adminProtect from "../middlewares/adminProtect.js";

const router = express.Router();

router.post("/",  CategoryController.addCategory);
router.get("/",  CategoryController.getCategory);
router.put("/:id",  CategoryController.updateCategory);
router.delete("/:id",  CategoryController.deleteCategory);

export default router;