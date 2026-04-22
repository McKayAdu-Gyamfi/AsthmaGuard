import express from "express";
import { getMe, updateMe } from "../controllers/userController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

// All user routes are protected
router.use(requireAuth);

router.get("/me", getMe);
router.put("/me", updateMe);

export default router;
