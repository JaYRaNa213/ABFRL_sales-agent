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
  const brands = ["louis philippe", "van heusen", "allen solly", "peter england", "manyavar", "biba", "and", "forever new", "global desi", "us polo", "nike", "puma", "levi's", "wrangler", "pepe jeans", "blackberrys", "arrow", "samsung", "apple", "xiaomi", "milton", "cello", "roadster", "fabindia", "sojanya", "hush puppies", "titan", "noise", "fossil"];
  const brandMatch = brands.find(b => message.includes(b));
  if (brandMatch) {
    products = products.filter(p => p.brand.toLowerCase().includes(brandMatch));
    matchedCriteria.push(brandMatch);
  }

  // Occasion/Tag Filter
  const occasions = ["party", "office", "formal", "casual", "ethnic", "wedding", "festival", "sports", "gym", "running", "fitness"];
  const occasionMatch = occasions.find(o => message.includes(o));
  if (occasionMatch) {
    products = products.filter(p =>
      p.tags.some(t => t.toLowerCase().includes(occasionMatch)) ||
      p.subCategory.toLowerCase().includes(occasionMatch)
    );
    matchedCriteria.push(occasionMatch);
  }

  // STRICT Category/Item Filter - MOST IMPORTANT
  // Map user intent to exact product categories
  const categoryMap = {
    "shirt": ["Shirts", "Formal Wear"],
    "t-shirt": ["T-Shirts"],
    "tshirt": ["T-Shirts"],
    "top": ["Tops"],
    "dress": ["Dresses", "Party Wear"],
    "kurta": ["Kurta", "Ethnic Wear"],
    "kurti": ["Kurta", "Ethnic Wear"],
    "blazer": ["Blazer"],
    "suit": ["Suits"],
    "jeans": ["Jeans"],
    "trouser": ["Pants"],
    "pants": ["Pants"],
    "shoe": ["Shoes"],
    "shoes": ["Shoes"],
    "sneaker": ["Shoes"],
    "watch": ["Watches"],
    "mobile": ["Mobiles"],
    "phone": ["Mobiles"],
    "bottle": ["Bottles"]
  };

  let categoryMatched = false;
  for (const [keyword, categories] of Object.entries(categoryMap)) {
    if (message.includes(keyword)) {
      products = products.filter(p =>
        categories.some(cat =>
          p.subCategory.includes(cat) ||
          p.name.toLowerCase().includes(keyword)
        )
      );
      matchedCriteria.push(keyword);
      categoryMatched = true;
      break; // Only match ONE category
    }
  }

  // If no specific category matched, do NOT show random products
  if (!categoryMatched && matchedCriteria.length === 0) {
    // Fallback: show top 5 popular items
    products = getAllProducts().slice(0, 5);
    matchedCriteria.push("Top Picks");
  }

  // 2. Selection & Formatting
  const topProducts = products.slice(0, 5);

  return {
    summary: matchedCriteria.length > 0 ? `Found matches for ${matchedCriteria.join(", ")}` : "Here are some recommendations.",
    products: topProducts
  };
}
