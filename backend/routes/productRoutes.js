import express from "express";
import ProductController from "../controllers/productController.js";
import adminProtect from "../middlewares/adminProtect.js";
import { upload } from "../middlewares/uploads.js";

const router = express.Router();


router.post("/products", adminProtect, upload.array("images", 5), ProductController.create);
router.get("/products", adminProtect, ProductController.getAllProducts);
router.get("/products/:id", adminProtect, ProductController.getOne);
router.put("/products/:id", adminProtect, upload.array("images", 5), ProductController.update);
router.delete("/products/:id", adminProtect, ProductController.remove);
export default router;