import { getAllProducts } from "../../services/productCatalog.service.js";
import { getCustomer } from "../../services/loyalty.service.js";

export async function recommendationAgent(context) {
  const customer = getCustomer(context.customerId || "CUST001");
  context.customerProfile = customer;

  const intentText = context.lastMessage.toLowerCase();
  let products = getAllProducts();

  // DYNAMIC FILTERING LOGIC
  // We explicitly check for common terms in the user's message
  // against product metadata (Category, SubCategory, Tags, Name, Brand)

  const tokens = intentText.split(/\s+/).filter(t => t.length > 2); // Simple tokenization

  let filtered = products.filter(p => {
    const textToSearch = [
      p.category,
      p.subCategory,
      p.name,
      p.brand,
      ...(p.tags || []),
      ...(p.colors || [])
    ].join(" ").toLowerCase();

    // Check if ANY token matches the product metadata
    // Priority to exact substring matches (e.g. "watch" in "Watches")
    return tokens.some(token => textToSearch.includes(token));
  });

  // Fallback: If no strict match, but user asked for "products" generally
  if (filtered.length === 0) {
    if (intentText.includes("top") || intentText.includes("best")) {
      filtered = products.filter(p => p.tags.includes("bestseller"));
    }
    else {
      // Default to a mixed bag or keep all if purely discovery
      // For now, let's return Bestsellers/New Arrivals as "Featured"
      // filtered = products.slice(0, 5); 
      // Better strategy: Don't show random things if we really don't know. 
      // But for a demo, showing features is better than empty.
      filtered = products.filter(p => p.tags.includes("bestseller") || p.tag === "new");
    }
  }

  // PERSONALIZATION SORTING
  if (customer?.loyaltyTier === "PLATINUM") {
    filtered = filtered.sort((a, b) => b.price - a.price);
  }

  context.products = filtered.slice(0, 4);

  // Update action to ensure panel shows them
  context.action = "SHOW_PRODUCTS";
  context.target = "AgentPanel";

  return {
    reason: filtered.length > 0 ? "Matched keywords" : "Default recommendations",
    count: filtered.length,
    loyaltyTier: customer?.loyaltyTier
  };
}
