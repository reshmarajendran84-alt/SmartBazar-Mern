import { protect } from "../middleware/authMiddleware.js";

router.get("/profile", protect, getProfile);
