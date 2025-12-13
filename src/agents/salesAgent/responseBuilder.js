export function buildResponse(text, context) {
  return {
    reply: text,
    sessionId: context.sessionId,
    channel: context.channel,
    cart: context.cart,
    offersApplied: context.offersApplied,
    fulfillment: context.fulfillment
  };
}
