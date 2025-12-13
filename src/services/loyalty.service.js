import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promotionsPath = path.join(__dirname, "../data/promotions.json");

const promotions = JSON.parse(
  fs.readFileSync(promotionsPath, "utf-8")
);

export function applyLoyalty(cart, tier) {
  const promo = promotions[tier] || { discountPercent: 0 };

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const savings = Math.round((total * promo.discountPercent) / 100);

  return {
    finalPrice: total - savings,
    savings
  };
}
