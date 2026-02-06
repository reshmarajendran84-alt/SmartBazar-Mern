import express from "express";
import AdminController from "../controllers/adminController.js";
import adminProtect from "../middlewares/adminProtect.js";

const router = express.Router();

router.post("/login", AdminController.login);
router.get("/users", adminProtect, AdminController.getAllUsers);
router.delete("/users/:id", adminProtect, AdminController.deleteUser);

export default router;