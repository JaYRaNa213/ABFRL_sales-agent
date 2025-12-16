import { getAllProducts } from "../../services/productCatalog.service.js";
import { getCustomer } from "../../services/loyalty.service.js";

export async function recommendationAgent(context) {
  const customer = getCustomer(context.customerId || "CUST001");
  context.customerProfile = customer;

  const intentText = context.lastMessage.toLowerCase();
  let products = getAllProducts();

  // STRICT CATEGORY MATCH
  if (intentText.includes("shoe")) {
    products = products.filter(p => p.subCategory === "Shoes");
  }

  // PERSONALIZATION
  if (customer?.loyaltyTier === "PLATINUM") {
    products = products.sort((a, b) => b.price - a.price);
  }

  context.products = products.slice(0, 4);
  context.action = "SHOW_PRODUCTS";
  context.target = "AgentPanel";

  return {
    reason: "Personalized recommendation",
    loyaltyTier: customer?.loyaltyTier
  };
}
