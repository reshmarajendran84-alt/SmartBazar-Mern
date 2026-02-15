import express from "express";
import CategoryController from "../controllers/categoryController.js";
import adminProtect from "../middlewares/adminProtect.js";

const router=express.Router();

router.post("/",adminProtect, CategoryController.addCategory);
router.get("/",CategoryController.getCategory);
router.put("/category/:id",CategoryController.updateCategory);
router.delete("/category/:id",CategoryController.deleteCategory);

export default  router;