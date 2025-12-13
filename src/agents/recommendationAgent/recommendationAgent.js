import { getProductsByCategory } from "../../services/productCatalog.service.js";

export async function recommendationAgent(context) {
  const products = getProductsByCategory("Formal Wear");

  context.cart.push(products[0]);

  return {
    summary: `I recommend ${products[0].name} priced at ₹${products[0].price}.`
  };
}
