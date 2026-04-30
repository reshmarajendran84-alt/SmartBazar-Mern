import express from "express";
import AdminUserController from "../controllers/adminUserController.js";
import adminProtect from "../middlewares/adminProtect.js"; // Remove curly braces for default export

const router = express.Router();

router.get("/", adminProtect, AdminUserController.getUsers);

router.delete("/:id", adminProtect, AdminUserController.deleteUser);

export default router;