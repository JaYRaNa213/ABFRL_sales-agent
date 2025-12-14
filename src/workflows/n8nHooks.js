// import express from "express";
// import axios from "axios";

// const router = express.Router();

// export async function triggerWorkflow(webhookPath, data) {
//   try {
//     const n8nWebhook = `http://localhost:5678/webhook/${webhookPath}`;

//     const response = await axios.post(n8nWebhook, data, {
//       headers: { "Content-Type": "application/json" }
//     });

//     return response.data;
//   } catch (err) {
//     console.error(
//       "n8n workflow trigger error:",
//       err.response?.data || err.message
//     );
//     return null;
//   }
// }

// // Example API endpoint
// router.post("/trigger/:webhookPath", async (req, res) => {
//   const { webhookPath } = req.params;
//   const payload = req.body;

//   const result = await triggerWorkflow(webhookPath, payload);

//   res.json({
//     success: !!result,
//     result
//   });
// });

// export default router;



import axios from "axios";
import { N8N_CONFIG } from "../config/n8n.config.js";

export async function triggerWorkflow(webhookPath, payload) {
  try {
    const url = `${N8N_CONFIG.BASE_URL}/webhook/${webhookPath}`;

    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-agent-secret": N8N_CONFIG.SECRET
      },
      timeout: 5000
    });

    console.log(`✅ n8n workflow triggered: ${webhookPath}`);
    return response.data;
  } catch (err) {
    console.error(
      "❌ n8n workflow trigger error:",
      err.response?.data || err.message
    );
    return null;
  }
}
