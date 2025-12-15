import { getProductsByCategory, searchProducts, getAllProducts } from "../../services/productCatalog.service.js";

export async function recommendationAgent(context) {
  let products = [];
  let criteria = "popular items";

  // 1. Try to find category or query in the user message or intent entities (mock extraction)
  // In a real system, intent detector would pass entities.
  const message = context.lastMessage ? context.lastMessage.toLowerCase() : "";

  if (message.includes("formal")) {
    products = getProductsByCategory("Formal Wear"); // Matches subCategory or category logic in service
    criteria = "formal wear";
  } else if (message.includes("party")) {
    products = getProductsByCategory("Party Wear");
    criteria = "party wear";
  } else if (message.includes("ethnic") || message.includes("kurta")) {
    products = getProductsByCategory("Ethnic Wear");
    criteria = "ethnic wear";
  } else if (message.includes("casual")) {
    products = getProductsByCategory("Casual Wear");
    criteria = "casual wear";
  } else {
    // Default or search
    products = searchProducts(message);
    if (products.length === 0) {
      products = getAllProducts().slice(0, 5); // Fallback to top 5
      criteria = "our top picks";
    } else {
      criteria = `search results for "${message}"`;
    }
  }

  // Limit results
  const topProducts = products.slice(0, 3);

  const productNames = topProducts.map(p => `${p.name} (₹${p.price})`).join(", ");

  return {
    summary: `Based on your request for ${criteria}, I recommend: ${productNames}.`,
    products: topProducts
  };
}
