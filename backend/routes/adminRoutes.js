import express from "express";
import AdminController from "../controllers/adminController.js";
import adminProtect from "../middlewares/adminProtect.js";
import { validate } from "../middlewares/authValidationMiddleware.js";
import { adminLoginSchema } from "../validators/adminValidator.js";

const router = express.Router();

router.post("/login", validate(adminLoginSchema), AdminController.login);
router.get("/users", adminProtect, AdminController.getAllUsers);
router.delete("/users/:id", adminProtect, AdminController.deleteUser);

export default router;
