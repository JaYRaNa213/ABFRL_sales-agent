import { checkInventory } from "../../services/inventory.service.js";

export async function inventoryAgent(context) {
  const item = context.cart[0];
  const stock = checkInventory(item.sku, "Orion Mall");

  return {
    summary: stock.storeStock > 0
      ? "Item is available in Orion Mall."
      : "Item is currently out of stock in nearby stores."
  };
}
