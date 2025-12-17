export async function inventoryAgent(context) {
  // If specific action is requested
  if (context.action === 'add_to_cart') {
    if (context.products && context.products.length > 0) {
      // Default to the first product (which should be the selected one)
      const productToAdd = context.products[0];

      // Init cart if needed
      if (!context.cart) context.cart = [];

      // Check for duplicates
      const exists = context.cart.find(p => p.sku === productToAdd.sku);
      if (!exists) {
        // Frontend expects 'id' and 'quantity'
        context.cart.push({
          ...productToAdd,
          id: productToAdd.sku,
          quantity: 1
        });
      }

      context.action = "ADD_TO_CART_CONFIRMED";
      context.addedProduct = productToAdd; // For persona to reference
    } else {
      context.error = "No product selected to add.";
    }
    return;
  }

  // Default inventory check
  context.inventoryChecked = true;
  context.availableStores = ["Orion Mall", "Forum Mall"];
}
