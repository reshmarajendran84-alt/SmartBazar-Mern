import express from "express";
import adminProtect from "../middlewares/AdminProtectMiddleware.js";
import User from "../models/User.js";
import AdminController from "../controllers/adminController.js";
const router = express.Router();
router.post("/login", AdminController.login);

router.get("/users", adminAuth, adminController.getAllUsers);


router.get("/users/:id", adminProtect, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.json(user);
});


export default router;
