export function createInitialContext({ sessionId, channel }) {
  return {
    sessionId,
    channel,
    stage: "INIT", // 👈 IMPORTANT
    intent: null,
    cart: [],
    offersApplied: [],
    paymentStatus: null,
    fulfillment: null,
    conversationHistory: [],
    lastMessage: null,
    metadata: {}
  };
}
