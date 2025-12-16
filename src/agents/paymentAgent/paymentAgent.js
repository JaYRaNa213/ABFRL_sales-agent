// import { triggerWorkflow } from "../../workflows/n8nHooks.js";
import { processPayment } from "../../services/paymentGateway.service.js";

export async function paymentAgent(context) {
  const amount = context.cart.reduce((sum, i) => sum + i.price, 0);
  const orderId = `ORD-${Date.now()}`;

  const paymentResult = processPayment(amount);

  if (paymentResult.status === "success") {
    context.paymentStatus = "success";

    // await triggerWorkflow("payment-success", {
    //   userId: context.sessionId,
    //   orderId,
    //   amount,
    //   channel: context.channel
    // });

    // return { status: "success", orderId };
  }

  // await triggerWorkflow("payment-failure", {
  //   userId: context.sessionId,
  //   orderId
  // });

  // return { status: "failed" };
}
