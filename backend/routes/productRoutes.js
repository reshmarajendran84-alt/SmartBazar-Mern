import express from "express";
import ProductController from "../controllers/productController.js";
const router = express.Router();

router.get("/", ProductController.getProducts);
router.get("/:id", ProductController.getSingleProduct);
router.get("/search/filter", ProductController.searchAndFilterProducts);
export default router;