import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const offersPath = path.join(__dirname, "../data/offers.json");
const customersPath = path.join(__dirname, "../data/customers.json");

const offersData = JSON.parse(fs.readFileSync(offersPath, "utf-8"));
const customers = JSON.parse(fs.readFileSync(customersPath, "utf-8"));

export function getCustomer(customerId) {
  return customers.find(c => c.customerId === customerId);
}

export function getOffers() {
  return offersData;
}

export function calculateLoyaltyDiscount(tier) {
  return offersData.loyaltyTiers[tier] || { discountPercent: 0 };
}

export function applyLoyalty(cart, customerId) {
  const customer = getCustomer(customerId);
  const tier = customer ? customer.loyaltyTier : 'SILVER'; // Default

  const promo = calculateLoyaltyDiscount(tier);

  const total = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  const savings = Math.round((total * promo.discountPercent) / 100);

  return {
    originalTotal: total,
    finalPrice: total - savings,
    savings,
    tier
  };
}
