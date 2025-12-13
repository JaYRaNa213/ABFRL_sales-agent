import { applyLoyalty } from "../../services/loyalty.service.js";

export async function loyaltyAgent(context) {
  const tier = "GOLD"; // mock tier
  const result = applyLoyalty(context.cart, tier);

  context.offersApplied.push("LOYALTY_DISCOUNT");

  return result;
}
