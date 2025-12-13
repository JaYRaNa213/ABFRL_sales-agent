export function detectIntent(message) {
  if (!message || typeof message !== "string") {
    return "general_query";
  }

  const text = message.toLowerCase();

  if (text.includes("buy") || text.includes("looking for")) return "product_discovery";
  if (text.includes("available") || text.includes("stock")) return "check_inventory";
  if (text.includes("offer") || text.includes("discount")) return "apply_offer";
  if (text.includes("pay") || text.includes("checkout")) return "checkout";
  if (text.includes("return") || text.includes("exchange")) return "post_purchase";

  return "general_query";
}
