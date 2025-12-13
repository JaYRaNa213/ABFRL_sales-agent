export function createInitialContext({ sessionId, channel }) {
  return {
    sessionId,
    channel,
    customer: null,
    intent: null,
    cart: [],
    offersApplied: [],
    paymentStatus: null,
    fulfillment: null,
    conversationHistory: [],
    metadata: {}
  };
}
