import express from "express";
import ProductController from "../controllers/productController.js";
import adminProtect from "../middlewares/adminProtect.js";
import { upload } from "../middlewares/uploads.js";

const router = express.Router();


router.post("/", adminProtect, upload.array("images", 5), ProductController.create);
router.get("/", adminProtect, ProductController.getAllProducts);
router.get("/:id", adminProtect, ProductController.getOne);
router.put("/:id", adminProtect, upload.array("images", 5), ProductController.update);
router.delete("/:id", adminProtect, ProductController.remove);



router.get("/", ProductController.getAllProducts);
router.post("/:id",ProductController.getOne);
export default router;