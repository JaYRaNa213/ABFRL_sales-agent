import { triggerWorkflow } from "../../workflows/n8nHooks.js";

export const chatHandler = async (req, res) => {
  const { intent, userId } = req.body;

  // AI logic
  if (intent === "PAYMENT_SUCCESS") {
    await triggerWorkflow("payment-success", {
      userId,
      orderId: "ORD123",
      amount: 3499,
      channel: "web"
    });
  }

  res.json({ reply: "Order confirmed" });
};
