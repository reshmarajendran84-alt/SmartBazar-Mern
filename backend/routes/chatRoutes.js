import express from "express";
import ChatController from "../controllers/chatController.js";
// import protect from "../middlewares/authMiddleware.js";

const router =express.Router();

router.post("/message", ChatController.sendMessage);

export default router;