import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inventoryPath = path.join(__dirname, "../data/inventory.json");

const inventory = JSON.parse(
  fs.readFileSync(inventoryPath, "utf-8")
);

export function checkInventory(sku, store) {
  const item = inventory[sku];
  if (!item) return { available: false };

  return {
    online: item.online,
    storeStock: item.stores?.[store] || 0
  };
}
