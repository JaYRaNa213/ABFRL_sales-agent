export function buildResponse(text, context) {
  return {
    reply: text,
    sessionId: context.sessionId,
    channel: context.channel,
    cart: context.cart,
    offersApplied: context.offersApplied,
    fulfillment: context.fulfillment,
    products: context.products,
    action: context.action,
    target: context.target,
    layout: context.layout,
  };
}
