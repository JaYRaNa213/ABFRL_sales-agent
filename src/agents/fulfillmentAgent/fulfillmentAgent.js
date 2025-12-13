import { notifyStore } from "../../services/pos.service.js";

export async function fulfillmentAgent(context) {
  context.fulfillment = {
    type: "reserve_in_store",
    store: "Orion Mall",
    pickupTime: "Today 6 PM"
  };

  notifyStore(context.fulfillment);
}
