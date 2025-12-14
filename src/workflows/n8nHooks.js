

import axios from "axios";
import { N8N_CONFIG } from "../config/n8n.config.js";

export async function triggerWorkflow(webhookPath, payload) {
  try {
    const url = `${N8N_CONFIG.BASE_URL}/webhook/${webhookPath}`;

    console.log(`🔗 Triggering n8n webhook: ${url}`);
    console.log(`📦 Payload:`, JSON.stringify(payload, null, 2));

    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-agent-secret": N8N_CONFIG.SECRET
      },
      timeout: 15000,
      validateStatus: (status) => status < 500 // Accept 2xx, 3xx, 4xx as valid responses
    });

    console.log(`✅ n8n workflow triggered: ${webhookPath}`);
    console.log(`📥 Response status: ${response.status}`);
    console.log(`📥 Response data:`, response.data);

    return response.data;
  } catch (err) {
    if (err.response) {
      // Server responded with error status
      console.error(`❌ n8n workflow trigger error (${err.response.status}):`, {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data,
        headers: err.response.headers
      });
    } else if (err.request) {
      // Request was made but no response received
      console.error(`❌ n8n workflow trigger error (no response):`, {
        message: err.message,
        code: err.code,
        url: `${N8N_CONFIG.BASE_URL}/webhook/${webhookPath}`
      });
      console.error(`💡 Check if n8n is running on ${N8N_CONFIG.BASE_URL}`);
    } else {
      // Error setting up request
      console.error(`❌ n8n workflow trigger error (setup):`, err.message);
    }
    return null;
  }
}
