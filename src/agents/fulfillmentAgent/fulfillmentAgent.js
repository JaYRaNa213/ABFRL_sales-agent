export async function fulfillmentAgent(context) {
  context.fulfillment = {
    mode: "Click & Collect",
    store: "Orion Mall",
    time: "Today 6 PM"
  };
}
