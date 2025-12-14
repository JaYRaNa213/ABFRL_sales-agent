import express from "express";
import axios from "axios";

const router = express.Router();

export async function triggerWorkflow(webhookPath, data) {
  try {
    const n8nWebhook = `http://localhost:5678/webhook/${webhookPath}`;

    const response = await axios.post(n8nWebhook, data, {
      headers: { "Content-Type": "application/json" }
    });

    return response.data;
  } catch (err) {
    console.error(
      "n8n workflow trigger error:",
      err.response?.data || err.message
    );
    return null;
  }
}

// Example API endpoint
router.post("/trigger/:webhookPath", async (req, res) => {
  const { webhookPath } = req.params;
  const payload = req.body;

  const result = await triggerWorkflow(webhookPath, payload);

  res.json({
    success: !!result,
    result
  });
});

export default router;
