import express from "express";
import { getMe, updateMe, getEmergencyContacts, deleteEmergencyContact } from "../controllers/userController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

// All user routes are protected
router.use(requireAuth);

router.get("/me", getMe);
router.put("/me", updateMe);
router.get("/emergency-contacts", getEmergencyContacts);
router.delete("/emergency-contacts/:email", deleteEmergencyContact);

export default router;
