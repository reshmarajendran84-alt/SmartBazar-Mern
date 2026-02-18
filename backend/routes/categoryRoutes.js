import express from "express";
import CategoryController from "../controllers/categoryController.js";
import adminProtect from "../middlewares/adminProtect.js";

const router=express.Router();

router.post("/",adminProtect, CategoryController.addCategory);
router.get("/", adminProtect, CategoryController.getCategory);
// router.put("/category/:id",CategoryController.updateCategory);
// router.delete("/category/:id",CategoryController.deleteCategory);

router.put("/:id", adminProtect, CategoryController.updateCategory);
router.delete("/:id", adminProtect, CategoryController.deleteCategory);


export default  router;