import express from "express";
import categoryController from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", categoryController.getCategory);
router.get("/:id", categoryController.getSingleCategory);

export default router;