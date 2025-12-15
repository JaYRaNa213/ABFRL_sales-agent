import { applyLoyalty } from "../../services/loyalty.service.js";

export async function loyaltyAgent(context) {
  const customerId = context.customerId || "CUST001"; // Default to first mock customer

  const result = applyLoyalty(context.cart, customerId);

  context.offersApplied.push(`LOYALTY_${result.tier}`);

  // Adding a summary string for the sales agent to consume
  result.summary = `Applied ${result.tier} tier discount. You saved ₹${result.savings}. Final total is ₹${result.finalPrice}.`;

  return result;
}
