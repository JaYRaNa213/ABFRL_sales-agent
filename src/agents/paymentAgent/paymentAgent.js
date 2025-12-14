import { triggerWorkflow } from "../../workflows/n8nHooks.js";

export async function paymentAgent(userId, orderId, amount) {
  try {
    // ... your payment logic
    const paymentSuccess = true; // simulate

    if (paymentSuccess) {
      // Trigger n8n workflow
      await triggerWorkflow("payment-success", {
        userId,
        orderId,
        amount,
      });
    }

    return { success: paymentSuccess };
  } catch (err) {
    console.error("Payment failed:", err);
    
    await triggerWorkflow("payment-failure", { userId, orderId });
    return { success: false };
  }
}
