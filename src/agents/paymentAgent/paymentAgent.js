import { processPayment } from "../../services/paymentGateway.service.js";

export async function paymentAgent(context) {
  const totalAmount = context.cart.reduce((sum, i) => sum + i.price, 0);
  const payment = processPayment(totalAmount);

  context.paymentStatus = payment.status;

  return payment;
}
