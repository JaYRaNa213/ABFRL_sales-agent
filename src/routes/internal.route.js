import express from "express";
import { notifyPOS, updateLoyalty } from "../controllers/internal.controller.js";

const router = express.Router();

/**
 * Called by n8n
 */
router.post("/pos/notify", notifyPOS);
router.post("/loyalty/update", updateLoyalty);

export default router;
