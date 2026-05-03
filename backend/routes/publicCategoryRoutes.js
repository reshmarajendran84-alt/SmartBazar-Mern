import express from "express";
import CategoryController from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", CategoryController.getCategory);
router.get("/:id", CategoryController.getSingleCategory);

export default router;