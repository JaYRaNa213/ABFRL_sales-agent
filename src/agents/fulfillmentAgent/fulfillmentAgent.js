export async function fulfillmentAgent(context) {
  const orderId = "ORD" + Math.floor(Math.random() * 10000);
  const store = context.customerProfile?.preferredStore || "Orion Mall";

  context.fulfillment = {
    status: "confirmed",
    orderId: orderId,
    mode: "Click & Collect",
    store: store,
    time: "Today 6 PM",
    message: `Booking confirmed! Your order #${orderId} is ready for pickup at ${store} today at 6 PM.`
  };

  // Clear cart after successful booking
  context.cart = [];
}
