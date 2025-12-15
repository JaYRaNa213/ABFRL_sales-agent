import { checkStock } from "../../services/inventory.service.js";

export async function inventoryAgent(context) {
  // If cart has items, check the last added item, or check a specific product if mentioned
  // For now, assuming we are checking the last item looked at or in cart.

  let skuToCheck = null;
  let productName = "Item";

  if (context.currentProduct) {
    skuToCheck = context.currentProduct.sku;
    productName = context.currentProduct.name;
  } else if (context.cart && context.cart.length > 0) {
    const lastItem = context.cart[context.cart.length - 1];
    skuToCheck = lastItem.sku;
    productName = lastItem.name;
  }

  if (!skuToCheck) {
    return {
      summary: "I'm not sure which product you want to check stock for. Could you clarify?"
    };
  }

  const stock = checkStock(skuToCheck);

  if (!stock.available) {
    // Check if it's available in stores even if not online
    const storeNames = Object.keys(stock.stores).filter(s => stock.stores[s] > 0);
    if (storeNames.length > 0) {
      return {
        summary: `The ${productName} is out of stock online, but available at: ${storeNames.join(", ")}.`
      };
    }
    return {
      summary: `Sorry, the ${productName} is currently out of stock everywhere.`
    };
  }

  return {
    summary: `Yes, we have ${stock.online} units of ${productName} available online.`
  };
}
