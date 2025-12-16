export async function inventoryAgent(context) {
  context.inventoryChecked = true;
  context.availableStores = ["Orion Mall", "Forum Mall"];
}
