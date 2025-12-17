export function createInitialContext({ sessionId, channel }) {
  return {
    sessionId,
    channel,
    inputMode: "text",   // 🔥 FIXED
    stage: "INIT",
    intent: null,

    customerProfile: null,
    cart: [],
    offersApplied: [],
    orchestration: [],   // 🔥 VISIBLE AGENT FLOW

    fulfillment: null,
    paymentStatus: null,

    conversationHistory: [],
    lastMessage: null,

    metadata: {
      store: null,
      season: "festive"
    }
  };
}
