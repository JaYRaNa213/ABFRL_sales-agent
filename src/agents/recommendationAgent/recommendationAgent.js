import { getProductsByCategory, searchProducts, getAllProducts } from "../../services/productCatalog.service.js";

export async function recommendationAgent(context) {
  // 1. Strict Attribute Extraction & Filtering
  const message = context.lastMessage ? context.lastMessage.toLowerCase() : "";
  let products = getAllProducts();
  let matchedCriteria = [];

  // Gender Filter
  if (message.includes("women") || message.includes("lady") || message.includes("ladies") || message.includes("girl")) {
    products = products.filter(p => p.category === "Women");
    matchedCriteria.push("Women");
  } else if (message.includes("men") || message.includes("man") || message.includes("boy") || message.includes("guy")) {
    products = products.filter(p => p.category === "Men");
    matchedCriteria.push("Men");
  }

  // Brand Filter
  const brands = ["louis philippe", "van heusen", "allen solly", "peter england", "manyavar", "biba", "and", "forever new", "global desi", "us polo"];
  const brandMatch = brands.find(b => message.includes(b));
  if (brandMatch) {
    products = products.filter(p => p.brand.toLowerCase().includes(brandMatch));
    matchedCriteria.push(brandMatch);
  }

  // Occasion/Tag Filter
  const occasions = ["party", "office", "formal", "casual", "ethnic", "wedding", "festival"];
  const occasionMatch = occasions.find(o => message.includes(o));
  if (occasionMatch) {
    products = products.filter(p =>
      p.tags.some(t => t.toLowerCase().includes(occasionMatch)) ||
      p.subCategory.toLowerCase().includes(occasionMatch)
    );
    matchedCriteria.push(occasionMatch);
  }

  // Category/Item Filter (Generic fallback if no specific attributes found, or addition to attributes)
  const items = ["shirt", "t-shirt", "top", "dress", "kurta", "blazer", "suit", "jeans", "trouser", "skirt"];
  const itemMatch = items.find(i => message.includes(i));
  if (itemMatch) {
    products = products.filter(p =>
      p.name.toLowerCase().includes(itemMatch) ||
      p.subCategory.toLowerCase().includes(itemMatch)
    );
    matchedCriteria.push(itemMatch);
  }

  // Fallback: If no strict filters applied and no products found, do a broad search or return top picks
  if (matchedCriteria.length === 0) {
    products = searchProducts(message);
    if (products.length === 0) {
      // Ultimate fallback
      products = getAllProducts().slice(0, 5);
      matchedCriteria.push("Top Picks");
    }
  }

  // 2. Selection & Formatting
  const topProducts = products.slice(0, 5);

  return {
    summary: matchedCriteria.length > 0 ? `Found matches for ${matchedCriteria.join(", ")}` : "Here are some recommendations.",
    products: topProducts
  };
}
