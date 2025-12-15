import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inventoryPath = path.join(__dirname, "../data/inventory.json");

const inventory = JSON.parse(
  fs.readFileSync(inventoryPath, "utf-8")
);

export function getInventoryForProduct(sku) {
  return inventory[sku] || null;
}

export function checkStock(sku, qty = 1) {
  const item = inventory[sku];
  if (!item) return { available: false, online: 0, stores: {} };

  // Simple check: is there enough stock online?
  // In a real scenario we'd check store preference too.
  const isAvailable = item.online >= qty;
  return {
    available: isAvailable,
    online: item.online,
    stores: item.stores
  };
}

export function checkInventory(sku, store) {
  const item = inventory[sku];
  if (!item) return { available: false };

  return {
    online: item.online,
    storeStock: item.stores?.[store] || 0
  };
}
