import express from "express";
import { v4 as uuid } from "uuid";

import { getSession, updateSession } from "../context/sessionStore.js";
import { salesAgent } from "../agents/salesAgent/salesAgent.js";
import { triggerWorkflow } from "../workflows/n8nHooks.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message, sessionId, channel } = req.body;

  const sid = sessionId || uuid();
  const context = getSession(sid, channel || "web");

  const response = await salesAgent(message, context);
  updateSession(sid, context);

  res.json(response);
});

/**
 * Direct payment webhook endpoint
 * Accepts payment data and triggers n8n webhook
 * POST /api/chat/payment
 * Body: { userId, orderId, amount, channel }
 */
router.post("/payment", async (req, res) => {
  try {
    const { userId, orderId, amount, channel } = req.body;

    // Validate required fields
    if (!userId || !orderId || !amount) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["userId", "orderId", "amount"],
        received: Object.keys(req.body)
      });
    }

    // Validate amount is a number
    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        error: "Invalid amount",
        message: "Amount must be a positive number"
      });
    }

    console.log(`📥 Payment webhook request:`, { userId, orderId, amount: amountNum, channel: channel || "web" });

    // Trigger n8n webhook
    const webhookPayload = {
      userId,
      orderId,
      amount: amountNum,
      channel: channel || "web"
    };

    const result = await triggerWorkflow("payment-success", webhookPayload);

    if (result === null) {
      return res.status(500).json({
        error: "Failed to trigger n8n webhook",
        message: "Check server logs for details"
      });
    }

    console.log(`✅ Payment webhook triggered successfully for order: ${orderId}`);

    res.json({
      success: true,
      message: "Payment webhook triggered successfully",
      orderId,
      n8nResponse: result
    });
  } catch (error) {
    console.error("❌ Error in payment webhook endpoint:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});

export default router;
