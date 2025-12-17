import { applyLoyalty } from "../../services/loyalty.service.js";

export async function loyaltyAgent(context) {
  const customerId = context.customerId || "CUST001"; // Default to first mock customer

  // 1. If Cart has items, apply loyalty to Cart
  if (context.cart && context.cart.length > 0) {
    const result = applyLoyalty(context.cart, customerId);
    context.offersApplied.push(`LOYALTY_${result.tier}`);

    // Summary for LLM consumption
    result.summary = `Applied ${result.tier} tier discount of ${result.savings}. Final total is ${result.finalPrice}.`;
    return result;
  }

  // 2. If Cart is empty but products are displayed (Context Awareness), simulate offer on the FIRST product
  else if (context.products && context.products.length > 0) {
    // Simulate adding the first product to a temp cart
    const firstProduct = context.products[0];
    const tempCart = [{ ...firstProduct, qty: 1 }];

    const result = applyLoyalty(tempCart, customerId);

    // We don't push to offersApplied yet because it's just a simulation
    // We just return the data for the LLM to speak it

    result.summary = `(SIMULATED) If you buy ${firstProduct.name}, ${result.tier} tier discount would save you ₹${result.savings}. Final price would be ₹${result.finalPrice}.`;
    result.simulated = true;

    return result;
  }

  return { summary: "No items in cart to apply offers." };
}
