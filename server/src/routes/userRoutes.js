import express from "express";
import { getMe, updateMe, getEmergencyContacts, deleteEmergencyContact, deleteMe } from "../controllers/userController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

// All user routes are protected
router.use(requireAuth);

router.get("/me", getMe);
router.put("/me", updateMe);
router.delete("/me", deleteMe);
router.get("/emergency-contacts", getEmergencyContacts);
router.delete("/emergency-contacts/:email", deleteEmergencyContact);

export default router;
