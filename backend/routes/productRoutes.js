import express from "express";
import ProductController from "../controllers/productController.js";
import adminProtect from "../middlewares/adminProtect.js";

const router = express.Router();

router.post("/", adminProtect, ProductController.create);
router.get("/", adminProtect,ProductController.getAll);
router.get("/:id",adminProtect, ProductController.getOne);
router.put("/:id", adminProtect, ProductController.update);
router.delete("/:id", adminProtect, ProductController.remove);

export default router;
