import express from "express";
import AdminController from "../controllers/adminController.js";
import adminProtect from "../middlewares/adminProtect.js";
import { validate, loginValidationRules } from "../middlewares/authValidationMiddleware.js";

const router = express.Router();

router.post("/login", loginValidationRules, validate, AdminController.login);
router.get("/users", adminProtect, AdminController.getAllUsers);
router.delete("/users/:id", adminProtect, AdminController.deleteUser);

export default router;