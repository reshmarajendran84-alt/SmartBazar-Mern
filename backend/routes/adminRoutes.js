import express from "express";
import AdminController from "../controllers/adminController.js";
import { validate } from "../middlewares/authValidationMiddleware.js";
import { adminLoginSchema } from "../validators/adminValidator.js";
import adminProtect from "../middlewares/AdminProtectMiddleware.js";

const router = express.Router();

router.get("/dashboard", adminProtect, (req, res) => {
  res.json({
    message: "Welcome Admin",
    admin: req.admin.email,
  });
});

router.post("/login", validate(adminLoginSchema), AdminController.login);

export default router;
