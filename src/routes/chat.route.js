import express from "express";
import { v4 as uuid } from "uuid";

import { getSession, updateSession } from "../context/sessionStore.js";
import { salesAgent } from "../agents/salesAgent/salesAgent.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message, sessionId, channel } = req.body;

  const sid = sessionId || uuid();
  const context = getSession(sid, channel || "web");

  const response = await salesAgent(message, context);
  updateSession(sid, context);

  res.json(response);
});

export default router;
